//
//  ApppPApp.swift
//  ApppP
//
//  Created by Sultanov Amir on 12.05.2026.
//

import SwiftUI

@main
struct ApppPApp: App {
    @StateObject private var session = SessionStore()
    @StateObject private var offline = OfflineStore.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(session)
                .environmentObject(offline)
                .preferredColorScheme(.dark)
                .task {
                    await session.restore()
                }
        }
    }
}
