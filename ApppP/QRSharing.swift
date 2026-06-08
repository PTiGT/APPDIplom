import SwiftUI
import Foundation
import Compression
import CoreImage
import CoreImage.CIFilterBuiltins
import AVFoundation

// MARK: - Shared content codec

/// Кодирование/декодирование документации для передачи через QR-код.
/// Полезная нагрузка сжимается zlib и кодируется в base64, чтобы поместиться в QR.
enum SharedContent {
    static let prefix = "APPPDOC1:"

    struct Payload: Codable {
        let v: Int
        let section: String
        let pages: [DocumentationPage]
    }

    static func encode(section: String, pages: [DocumentationPage]) -> String? {
        let payload = Payload(v: 1, section: section, pages: pages)
        guard let json = try? JSONEncoder().encode(payload) else { return nil }
        guard let compressed = try? (json as NSData).compressed(using: .zlib) as Data else { return nil }
        return prefix + compressed.base64EncodedString()
    }

    static func decode(_ raw: String) -> Payload? {
        let trimmed = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        guard trimmed.hasPrefix(prefix) else { return nil }
        let base64 = String(trimmed.dropFirst(prefix.count))
        guard let compressed = Data(base64Encoded: base64) else { return nil }
        guard let json = try? (compressed as NSData).decompressed(using: .zlib) as Data else { return nil }
        return try? JSONDecoder().decode(Payload.self, from: json)
    }
}

// MARK: - QR generation

enum QRCodeGenerator {
    private static let context = CIContext()

    static func image(from string: String) -> UIImage? {
        let filter = CIFilter.qrCodeGenerator()
        filter.message = Data(string.utf8)
        filter.correctionLevel = "L"

        guard let output = filter.outputImage else { return nil }
        let scaled = output.transformed(by: CGAffineTransform(scaleX: 12, y: 12))
        guard let cgImage = context.createCGImage(scaled, from: scaled.extent) else { return nil }
        return UIImage(cgImage: cgImage)
    }
}

// MARK: - Share sheet

struct ShareSheet: UIViewControllerRepresentable {
    let items: [Any]

    func makeUIViewController(context: Context) -> UIActivityViewController {
        UIActivityViewController(activityItems: items, applicationActivities: nil)
    }

    func updateUIViewController(_ controller: UIActivityViewController, context: Context) {}
}

// MARK: - QR sheet for documentation

struct DocumentationQRSheet: View {
    let section: String
    let pages: [DocumentationPage]

    @Environment(\.dismiss) private var dismiss
    @State private var shareImage: UIImage?
    @State private var showShare = false

    private var encoded: String? {
        SharedContent.encode(section: section, pages: pages)
    }

    private var qrImage: UIImage? {
        guard let encoded else { return nil }
        return QRCodeGenerator.image(from: encoded)
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    if let qrImage {
                        Image(uiImage: qrImage)
                            .interpolation(.none)
                            .resizable()
                            .scaledToFit()
                            .frame(maxWidth: 280)
                            .padding(16)
                            .background(.white, in: RoundedRectangle(cornerRadius: 20))

                        Text(section)
                            .font(.headline)
                        Text("\(pages.count) страниц • отсканируйте код во вкладке «Оффлайн», чтобы сохранить документацию")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                            .multilineTextAlignment(.center)

                        Button {
                            shareImage = qrImage
                            showShare = true
                        } label: {
                            Label("Поделиться кодом", systemImage: "square.and.arrow.up")
                                .frame(maxWidth: .infinity)
                        }
                        .buttonStyle(.borderedProminent)
                    } else {
                        ContentUnavailableView {
                            Label("Слишком много данных", systemImage: "qrcode")
                        } description: {
                            Text("Документация раздела не помещается в один QR-код. Поделитесь отдельной страницей.")
                        }
                    }
                }
                .padding()
            }
            .navigationTitle("QR документации")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Готово") { dismiss() }
                }
            }
            .sheet(isPresented: $showShare) {
                if let shareImage {
                    ShareSheet(items: [shareImage])
                }
            }
        }
    }
}

// MARK: - Scanner

struct QRScannerView: UIViewControllerRepresentable {
    var onResult: (String) -> Void

    func makeCoordinator() -> Coordinator {
        Coordinator(onResult: onResult)
    }

    func makeUIViewController(context: Context) -> ScannerViewController {
        let controller = ScannerViewController()
        controller.delegate = context.coordinator
        return controller
    }

    func updateUIViewController(_ controller: ScannerViewController, context: Context) {}

    final class Coordinator: NSObject, ScannerViewControllerDelegate {
        let onResult: (String) -> Void
        private var didFind = false

        init(onResult: @escaping (String) -> Void) {
            self.onResult = onResult
        }

        func scanner(_ controller: ScannerViewController, didScan code: String) {
            guard !didFind else { return }
            didFind = true
            onResult(code)
        }
    }
}

protocol ScannerViewControllerDelegate: AnyObject {
    func scanner(_ controller: ScannerViewController, didScan code: String)
}

final class ScannerViewController: UIViewController, AVCaptureMetadataOutputObjectsDelegate {
    weak var delegate: ScannerViewControllerDelegate?

    private let session = AVCaptureSession()
    private var previewLayer: AVCaptureVideoPreviewLayer?
    private let sessionQueue = DispatchQueue(label: "qr.scanner.session")

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .black
        configureSession()
    }

    private func configureSession() {
        guard let device = AVCaptureDevice.default(for: .video),
              let input = try? AVCaptureDeviceInput(device: device),
              session.canAddInput(input) else { return }

        session.addInput(input)

        let output = AVCaptureMetadataOutput()
        guard session.canAddOutput(output) else { return }
        session.addOutput(output)
        output.setMetadataObjectsDelegate(self, queue: .main)
        output.metadataObjectTypes = [.qr]

        let layer = AVCaptureVideoPreviewLayer(session: session)
        layer.videoGravity = .resizeAspectFill
        layer.frame = view.layer.bounds
        view.layer.addSublayer(layer)
        previewLayer = layer
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        let session = self.session
        sessionQueue.async {
            if !session.isRunning {
                session.startRunning()
            }
        }
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        let session = self.session
        sessionQueue.async {
            if session.isRunning {
                session.stopRunning()
            }
        }
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        previewLayer?.frame = view.layer.bounds
    }

    func metadataOutput(
        _ output: AVCaptureMetadataOutput,
        didOutput metadataObjects: [AVMetadataObject],
        from connection: AVCaptureConnection
    ) {
        guard let object = metadataObjects.first as? AVMetadataMachineReadableCodeObject,
              let value = object.stringValue else { return }
        delegate?.scanner(self, didScan: value)
    }
}
