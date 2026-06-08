const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function lesson(title, content) {
  return { title, content };
}

const javaCourse = [
  {
    title: "Основы Java",
    topics: [
      {
        title: "Синтаксис и запуск",
        lessons: [
          lesson(
            "Что такое Java",
            `<h2>Java как платформа</h2>
            <p>Java - строго типизированный объектно-ориентированный язык. Код компилируется в байткод и запускается на JVM, поэтому одну программу можно запускать на разных операционных системах.</p>
            <h2>Минимальная программа</h2>
            <pre><code>public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}</code></pre>
            <h2>Что запомнить</h2>
            <ul><li>Имя публичного класса обычно совпадает с именем файла.</li><li>Точка входа программы - метод <code>main</code>.</li><li>Java широко используется в backend, Android, enterprise-системах и больших сервисах.</li></ul>
            <h2>Практика</h2>
            <p>Создай файл <code>Main.java</code>, выведи своё имя и одну цель изучения Java.</p>`,
          ),
          lesson(
            "JDK, JVM и компиляция",
            `<h2>JDK и JVM</h2>
            <p><code>JDK</code> нужен для разработки: в нём есть компилятор <code>javac</code>. <code>JVM</code> запускает уже скомпилированный байткод.</p>
            <h2>Команды запуска</h2>
            <pre><code>javac Main.java
java Main</code></pre>
            <h2>Путь выполнения</h2>
            <ol><li>Разработчик пишет <code>.java</code> файл.</li><li><code>javac</code> создаёт <code>.class</code> файл.</li><li><code>java</code> запускает байткод на JVM.</li></ol>
            <h2>Частые ошибки</h2>
            <ul><li>Запускать <code>java Main.java</code> там, где ожидается имя класса.</li><li>Называть файл не так, как публичный класс.</li><li>Забывать точку с запятой в конце инструкции.</li></ul>`,
          ),
        ],
      },
      {
        title: "Переменные и типы",
        lessons: [
          lesson(
            "Переменные и примитивные типы",
            `<h2>Статическая типизация</h2>
            <p>В Java тип переменной указывается явно и проверяется во время компиляции. Это помогает находить ошибки раньше.</p>
            <pre><code>int age = 21;
double price = 19.99;
boolean active = true;
char grade = 'A';
String name = "Amir";</code></pre>
            <h2>Основные примитивы</h2>
            <ul><li><code>int</code>, <code>long</code> - целые числа.</li><li><code>double</code>, <code>float</code> - дробные числа.</li><li><code>boolean</code> - логический тип.</li><li><code>char</code> - один символ.</li></ul>
            <h2>Практика</h2>
            <p>Создай переменные для имени курса, количества уроков и статуса публикации.</p>`,
          ),
          lesson(
            "Строки и преобразование типов",
            `<h2>String</h2>
            <p><code>String</code> - ссылочный тип для текста. Строки неизменяемы: операции создают новые строки.</p>
            <pre><code>String firstName = "Amir";
String message = "Привет, " + firstName;
System.out.println(message);</code></pre>
            <h2>Преобразование</h2>
            <pre><code>String value = "42";
int number = Integer.parseInt(value);
String text = String.valueOf(number);</code></pre>
            <h2>Частые ошибки</h2>
            <ul><li>Сравнивать строки через <code>==</code> вместо <code>equals</code>.</li><li>Не учитывать исключение при парсинге числа из строки.</li></ul>`,
          ),
        ],
      },
      {
        title: "Условия и циклы",
        lessons: [
          lesson(
            "Условия if и switch",
            `<h2>if / else</h2>
            <pre><code>int score = 87;

if (score >= 90) {
    System.out.println("Отлично");
} else if (score >= 70) {
    System.out.println("Хорошо");
} else {
    System.out.println("Нужно повторить");
}</code></pre>
            <h2>switch</h2>
            <pre><code>String role = "admin";
switch (role) {
    case "admin" -> System.out.println("Панель администратора");
    case "user" -> System.out.println("Профиль пользователя");
    default -> System.out.println("Неизвестная роль");
}</code></pre>
            <h2>Практика</h2>
            <p>Напиши проверку сложности задачи: easy, medium, hard.</p>`,
          ),
          lesson(
            "Циклы for, while и foreach",
            `<h2>for</h2>
            <pre><code>for (int i = 0; i < 5; i++) {
    System.out.println(i);
}</code></pre>
            <h2>while</h2>
            <pre><code>int count = 3;
while (count > 0) {
    System.out.println(count);
    count--;
}</code></pre>
            <h2>foreach</h2>
            <pre><code>String[] names = {"Ann", "Bob", "Kate"};
for (String name : names) {
    System.out.println(name);
}</code></pre>
            <p>Используй <code>break</code>, когда нужно выйти из цикла, и <code>continue</code>, когда нужно перейти к следующей итерации.</p>`,
          ),
        ],
      },
    ],
  },
  {
    title: "Коллекции и методы",
    topics: [
      {
        title: "Методы",
        lessons: [
          lesson(
            "Создание методов",
            `<h2>Зачем нужны методы</h2>
            <p>Методы помогают переиспользовать код и делить программу на понятные действия.</p>
            <pre><code>static int sum(int a, int b) {
    return a + b;
}

public static void main(String[] args) {
    System.out.println(sum(2, 3));
}</code></pre>
            <h2>Параметры и возвращаемое значение</h2>
            <p>Перед именем метода указывается тип результата. Если метод ничего не возвращает, используется <code>void</code>.</p>
            <h2>Практика</h2>
            <p>Напиши метод <code>formatUser</code>, который принимает имя и роль и возвращает строку.</p>`,
          ),
          lesson(
            "Перегрузка методов",
            `<h2>Overload</h2>
            <p>В Java можно создать несколько методов с одним именем, если у них разные параметры.</p>
            <pre><code>static int multiply(int a, int b) {
    return a * b;
}

static double multiply(double a, double b) {
    return a * b;
}</code></pre>
            <h2>Когда применять</h2>
            <p>Перегрузка уместна, когда действие одно и то же, но входные данные могут быть разных типов или количества.</p>`,
          ),
        ],
      },
      {
        title: "Массивы и списки",
        lessons: [
          lesson(
            "Массивы",
            `<h2>Фиксированный размер</h2>
            <p>Массив хранит элементы одного типа и имеет фиксированную длину.</p>
            <pre><code>int[] numbers = {1, 2, 3};
System.out.println(numbers[0]);
System.out.println(numbers.length);</code></pre>
            <h2>Проход по массиву</h2>
            <pre><code>for (int number : numbers) {
    System.out.println(number);
}</code></pre>
            <h2>Практика</h2>
            <p>Создай массив оценок и найди максимальное значение.</p>`,
          ),
          lesson(
            "ArrayList",
            `<h2>Динамический список</h2>
            <p><code>ArrayList</code> удобен, когда количество элементов заранее неизвестно.</p>
            <pre><code>import java.util.ArrayList;
import java.util.List;

List&lt;String&gt; languages = new ArrayList&lt;&gt;();
languages.add("Java");
languages.add("Python");
System.out.println(languages.get(0));</code></pre>
            <h2>Полезные методы</h2>
            <ul><li><code>add</code> - добавить элемент.</li><li><code>get</code> - получить по индексу.</li><li><code>remove</code> - удалить.</li><li><code>size</code> - получить размер.</li></ul>`,
          ),
        ],
      },
      {
        title: "Map и Set",
        lessons: [
          lesson(
            "HashMap",
            `<h2>Ключ-значение</h2>
            <p><code>HashMap</code> хранит пары ключ-значение и подходит для быстрого поиска по ключу.</p>
            <pre><code>import java.util.HashMap;
import java.util.Map;

Map&lt;String, String&gt; user = new HashMap&lt;&gt;();
user.put("name", "Amir");
user.put("role", "admin");
System.out.println(user.get("name"));</code></pre>
            <h2>Безопасное чтение</h2>
            <pre><code>String theme = user.getOrDefault("theme", "dark");</code></pre>
            <h2>Практика</h2>
            <p>Посчитай частоту слов в списке через <code>HashMap</code>.</p>`,
          ),
          lesson(
            "HashSet",
            `<h2>Уникальные значения</h2>
            <p><code>HashSet</code> хранит только уникальные элементы.</p>
            <pre><code>import java.util.HashSet;
import java.util.Set;

Set&lt;String&gt; tags = new HashSet&lt;&gt;();
tags.add("java");
tags.add("backend");
tags.add("java");
System.out.println(tags.size());</code></pre>
            <h2>Когда использовать</h2>
            <p>Set полезен для удаления дублей, проверки наличия элемента и работы с уникальными идентификаторами.</p>`,
          ),
        ],
      },
    ],
  },
  {
    title: "Объектно-ориентированная Java",
    topics: [
      {
        title: "Классы и объекты",
        lessons: [
          lesson(
            "Классы, поля и объекты",
            `<h2>Класс</h2>
            <p>Класс описывает данные и поведение будущих объектов.</p>
            <pre><code>class User {
    String name;
    String email;

    void greet() {
        System.out.println("Привет, " + name);
    }
}</code></pre>
            <h2>Объект</h2>
            <pre><code>User user = new User();
user.name = "Amir";
user.greet();</code></pre>
            <h2>Практика</h2>
            <p>Создай класс <code>Task</code> с полями <code>title</code> и <code>done</code>.</p>`,
          ),
          lesson(
            "Конструкторы",
            `<h2>Инициализация объекта</h2>
            <p>Конструктор вызывается при создании объекта и помогает задать обязательные поля.</p>
            <pre><code>class User {
    String name;

    User(String name) {
        this.name = name;
    }
}</code></pre>
            <h2>this</h2>
            <p><code>this</code> указывает на текущий объект. Часто используется, когда имя параметра совпадает с именем поля.</p>`,
          ),
        ],
      },
      {
        title: "Инкапсуляция и наследование",
        lessons: [
          lesson(
            "Модификаторы доступа и getters",
            `<h2>Инкапсуляция</h2>
            <p>Поля обычно делают <code>private</code>, а доступ к ним открывают через методы. Это защищает объект от некорректного состояния.</p>
            <pre><code>class User {
    private String email;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}</code></pre>
            <h2>Модификаторы</h2>
            <ul><li><code>public</code> - доступно всем.</li><li><code>private</code> - доступно только внутри класса.</li><li><code>protected</code> - доступно наследникам и пакету.</li></ul>`,
          ),
          lesson(
            "Наследование и abstract class",
            `<h2>extends</h2>
            <p>Наследование позволяет описать общий базовый класс и конкретные реализации.</p>
            <pre><code>abstract class Animal {
    abstract String speak();
}

class Dog extends Animal {
    @Override
    String speak() {
        return "woof";
    }
}</code></pre>
            <h2>Когда быть осторожным</h2>
            <p>Наследование создаёт сильную связь. Если объект просто использует другой объект, часто лучше выбрать композицию.</p>`,
          ),
        ],
      },
      {
        title: "Интерфейсы и исключения",
        lessons: [
          lesson(
            "Интерфейсы",
            `<h2>Контракт поведения</h2>
            <p>Интерфейс описывает, какие методы должен реализовать класс.</p>
            <pre><code>interface Notifier {
    void send(String message);
}

class EmailNotifier implements Notifier {
    public void send(String message) {
        System.out.println("Email: " + message);
    }
}</code></pre>
            <h2>Зачем нужны интерфейсы</h2>
            <p>Они помогают писать код через абстракции и легче заменять реализации.</p>`,
          ),
          lesson(
            "Исключения try / catch",
            `<h2>Обработка ошибок</h2>
            <pre><code>try {
    int value = Integer.parseInt("abc");
    System.out.println(value);
} catch (NumberFormatException error) {
    System.out.println("Это не число");
} finally {
    System.out.println("Завершено");
}</code></pre>
            <h2>Checked и unchecked</h2>
            <p>Checked-исключения компилятор требует обработать или пробросить. Unchecked чаще говорят об ошибке в логике программы.</p>
            <h2>Практика</h2>
            <p>Напиши метод, который безопасно парсит строку в число и возвращает значение по умолчанию при ошибке.</p>`,
          ),
        ],
      },
    ],
  },
  {
    title: "Практическая Java",
    topics: [
      {
        title: "Файлы и Stream API",
        lessons: [
          lesson(
            "Работа с файлами",
            `<h2>Files API</h2>
            <p>Класс <code>Files</code> из <code>java.nio.file</code> позволяет читать и записывать файлы.</p>
            <pre><code>import java.nio.file.Files;
import java.nio.file.Path;

String text = Files.readString(Path.of("data.txt"));
Files.writeString(Path.of("result.txt"), "Готово");</code></pre>
            <h2>Практика</h2>
            <p>Прочитай текстовый файл и посчитай количество строк.</p>`,
          ),
          lesson(
            "Stream API",
            `<h2>Декларативная обработка коллекций</h2>
            <p>Stream API помогает фильтровать, преобразовывать и агрегировать данные.</p>
            <pre><code>import java.util.List;

List&lt;Integer&gt; numbers = List.of(1, 2, 3, 4, 5, 6);
List&lt;Integer&gt; even = numbers.stream()
    .filter(n -> n % 2 == 0)
    .toList();</code></pre>
            <h2>Частые операции</h2>
            <ul><li><code>filter</code> - оставить нужные элементы.</li><li><code>map</code> - преобразовать элементы.</li><li><code>sorted</code> - отсортировать.</li><li><code>collect</code> / <code>toList</code> - собрать результат.</li></ul>`,
          ),
        ],
      },
      {
        title: "Backend на Java",
        lessons: [
          lesson(
            "Maven и Gradle",
            `<h2>Сборка проекта</h2>
            <p>Maven и Gradle управляют зависимостями, сборкой, тестами и запуском проекта.</p>
            <h2>Maven</h2>
            <pre><code>mvn test
mvn package</code></pre>
            <h2>Gradle</h2>
            <pre><code>./gradlew test
./gradlew build</code></pre>
            <h2>Что хранится в проекте</h2>
            <p>В Maven зависимости описываются в <code>pom.xml</code>, в Gradle - в <code>build.gradle</code> или <code>build.gradle.kts</code>.</p>`,
          ),
          lesson(
            "Spring Boot: минимальный REST API",
            `<h2>Spring Boot</h2>
            <p>Spring Boot - популярный фреймворк для backend-разработки на Java.</p>
            <pre><code>@RestController
class HealthController {
    @GetMapping("/health")
    Map&lt;String, String&gt; health() {
        return Map.of("status", "ok");
    }
}</code></pre>
            <h2>Что изучить дальше</h2>
            <ul><li>Controllers и DTO.</li><li>Validation.</li><li>Spring Data JPA.</li><li>Security и JWT.</li><li>Тестирование endpoints.</li></ul>`,
          ),
        ],
      },
      {
        title: "Тестирование и стиль",
        lessons: [
          lesson(
            "JUnit",
            `<h2>Unit-тесты</h2>
            <p>JUnit используется для автоматической проверки Java-кода.</p>
            <pre><code>import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

class CalculatorTest {
    @Test
    void addsNumbers() {
        assertEquals(5, Calculator.sum(2, 3));
    }
}</code></pre>
            <h2>Правило</h2>
            <p>Тестируй важную бизнес-логику и ошибки, которые легко пропустить вручную.</p>`,
          ),
          lesson(
            "Стиль Java-кода",
            `<h2>Имена</h2>
            <ul><li>Классы: <code>PascalCase</code>.</li><li>Методы и переменные: <code>camelCase</code>.</li><li>Константы: <code>UPPER_SNAKE_CASE</code>.</li></ul>
            <h2>Практики</h2>
            <ul><li>Держи классы небольшими и понятными.</li><li>Не смешивай в одном методе ввод, обработку и вывод.</li><li>Используй интерфейсы для сменяемых зависимостей.</li><li>Пиши понятные сообщения исключений.</li></ul>
            <h2>Инструменты</h2>
            <p>В реальных проектах часто используют Checkstyle, SpotBugs, форматирование IDE и проверки в CI.</p>`,
          ),
        ],
      },
    ],
  },
];

const guides = [
  {
    title: "Стандартная библиотека Java",
    content: `<h2>Что входит</h2><p>Стандартная библиотека Java покрывает коллекции, файлы, даты, потоки, сеть, конкурентность и многое другое.</p><ul><li><code>java.util</code> - коллекции и утилиты.</li><li><code>java.time</code> - дата и время.</li><li><code>java.nio.file</code> - работа с файлами.</li><li><code>java.net.http</code> - HTTP-клиент.</li></ul><h2>Мини-проект</h2><p>Сделай консольный список задач с сохранением в файл.</p>`,
  },
  {
    title: "Collections Framework",
    content: `<h2>Основные интерфейсы</h2><ul><li><code>List</code> - упорядоченный список.</li><li><code>Set</code> - уникальные элементы.</li><li><code>Map</code> - пары ключ-значение.</li><li><code>Queue</code> - очередь.</li></ul><h2>Как выбирать</h2><p>Для большинства задач начинай с интерфейса в типе переменной: <code>List&lt;String&gt; items = new ArrayList&lt;&gt;();</code>. Так код меньше зависит от конкретной реализации.</p>`,
  },
  {
    title: "Spring Boot",
    content: `<h2>Для чего нужен</h2><p>Spring Boot ускоряет создание backend-приложений: web endpoints, DI-контейнер, конфигурация, работа с БД и тестирование.</p><h2>Что изучить</h2><ul><li><code>@RestController</code> и routing.</li><li>DTO и validation.</li><li>Services и repositories.</li><li>Spring Data JPA.</li><li>Spring Security.</li></ul><h2>Мини-проект</h2><p>Сделай REST API заметок: создать, получить список, обновить, удалить.</p>`,
  },
  {
    title: "Maven и Gradle",
    content: `<h2>Назначение</h2><p>Системы сборки скачивают зависимости, запускают тесты, собирают jar-файл и помогают стандартизировать проект.</p><h2>Команды</h2><pre><code>mvn test
mvn package

./gradlew test
./gradlew build</code></pre><h2>Что важно</h2><p>Не коммить папки сборки вроде <code>target</code> и <code>build</code>; зависимости должны описываться в конфигурации проекта.</p>`,
  },
  {
    title: "Инструменты Java-разработчика",
    content: `<h2>Минимальный набор</h2><ul><li>JDK LTS-версии.</li><li>IntelliJ IDEA или VS Code с Java extensions.</li><li>Maven или Gradle.</li><li>JUnit для тестов.</li><li>Docker для окружения.</li></ul><h2>Workflow</h2><p>Пиши код небольшими шагами, запускай тесты, проверяй форматирование и держи конфигурацию проекта в репозитории.</p>`,
  },
];

const challenges = [
  {
    title: "Java: сумма двух чисел",
    difficulty: "easy",
    description: "Напиши код, который выводит сумму 2 и 3. Проверка ожидает результат 5.",
    starterCode:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println(2 + 3);\n    }\n}',
    expectedOutput: "5",
  },
  {
    title: "Java: приветствие",
    difficulty: "easy",
    description: "Создай строку приветствия для имени Amir. Проверка ожидает текст: Привет, Amir!",
    starterCode:
      'public class Main {\n    public static void main(String[] args) {\n        String name = "Amir";\n        System.out.println("Привет, " + name + "!");\n    }\n}',
    expectedOutput: "Привет, Amir!",
  },
  {
    title: "Java: чётные числа",
    difficulty: "easy",
    description: "Выведи чётные числа из массива [1, 2, 3, 4, 5, 6]. Проверка ожидает [2, 4, 6].",
    starterCode:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> result = List.of(2, 4, 6);\n        System.out.println(result);\n    }\n}',
    expectedOutput: "[2, 4, 6]",
  },
  {
    title: "Java: максимум в массиве",
    difficulty: "medium",
    description: "Найди максимум в массиве [4, 8, 2, 10, 3]. Проверка ожидает 10.",
    starterCode:
      "public class Main {\n    public static void main(String[] args) {\n        int[] numbers = {4, 8, 2, 10, 3};\n        int max = numbers[0];\n        for (int n : numbers) {\n            if (n > max) max = n;\n        }\n        System.out.println(max);\n    }\n}",
    expectedOutput: "10",
  },
  {
    title: "Java: HashMap пользователя",
    difficulty: "medium",
    description: "Создай Map пользователя и выведи email. Проверка ожидает amir@example.com.",
    starterCode:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<String, String> user = new HashMap<>();\n        user.put("email", "amir@example.com");\n        System.out.println(user.get("email"));\n    }\n}',
    expectedOutput: "amir@example.com",
  },
  {
    title: "Java: метод factorial",
    difficulty: "medium",
    description: "Напиши метод factorial и выведи factorial(5). Проверка ожидает 120.",
    starterCode:
      "public class Main {\n    static int factorial(int n) {\n        int result = 1;\n        for (int i = 2; i <= n; i++) {\n            result *= i;\n        }\n        return result;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(factorial(5));\n    }\n}",
    expectedOutput: "120",
  },
  {
    title: "Java: Stream квадраты",
    difficulty: "hard",
    description: "Сгенерируй квадраты чисел от 1 до 5 через Stream API. Проверка ожидает [1, 4, 9, 16, 25].",
    starterCode:
      "import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> squares = IntStream.rangeClosed(1, 5)\n            .map(n -> n * n)\n            .boxed()\n            .toList();\n        System.out.println(squares);\n    }\n}",
    expectedOutput: "[1, 4, 9, 16, 25]",
  },
  {
    title: "Java: частота слов",
    difficulty: "hard",
    description: "Посчитай количество слов java в списке [java, js, java, go]. Проверка ожидает 2.",
    starterCode:
      'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> words = List.of("java", "js", "java", "go");\n        long count = words.stream().filter(word -> word.equals("java")).count();\n        System.out.println(count);\n    }\n}',
    expectedOutput: "2",
  },
  {
    title: "Java: произведение чисел",
    difficulty: "easy",
    description: "Выведи произведение 4 и 5. Проверка ожидает 20.",
    starterCode:
      "public class Main {\n    public static void main(String[] args) {\n        System.out.println(4 * 5);\n    }\n}",
    expectedOutput: "20",
  },
  {
    title: "Java: разность чисел",
    difficulty: "easy",
    description: "Выведи разность 10 и 7. Проверка ожидает 3.",
    starterCode:
      "public class Main {\n    public static void main(String[] args) {\n        System.out.println(10 - 7);\n    }\n}",
    expectedOutput: "3",
  },
  {
    title: "Java: верхний регистр",
    difficulty: "easy",
    description: "Приведи строку java к верхнему регистру. Проверка ожидает JAVA.",
    starterCode:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("java".toUpperCase());\n    }\n}',
    expectedOutput: "JAVA",
  },
  {
    title: "Java: длина строки",
    difficulty: "easy",
    description: "Выведи длину строки Hello. Проверка ожидает 5.",
    starterCode:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello".length());\n    }\n}',
    expectedOutput: "5",
  },
  {
    title: "Java: остаток от деления",
    difficulty: "easy",
    description: "Выведи остаток от деления 17 на 5. Проверка ожидает 2.",
    starterCode:
      "public class Main {\n    public static void main(String[] args) {\n        System.out.println(17 % 5);\n    }\n}",
    expectedOutput: "2",
  },
  {
    title: "Java: логическое сравнение",
    difficulty: "easy",
    description: "Проверь, что 7 больше 3, и выведи результат. Проверка ожидает true.",
    starterCode:
      "public class Main {\n    public static void main(String[] args) {\n        System.out.println(7 > 3);\n    }\n}",
    expectedOutput: "true",
  },
  {
    title: "Java: конкатенация строк",
    difficulty: "easy",
    description: "Склей строки Go и lang. Проверка ожидает Golang.",
    starterCode:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Go" + "lang");\n    }\n}',
    expectedOutput: "Golang",
  },
  {
    title: "Java: сумма элементов массива",
    difficulty: "medium",
    description: "Посчитай сумму элементов массива [1, 2, 3, 4]. Проверка ожидает 10.",
    starterCode:
      "public class Main {\n    public static void main(String[] args) {\n        int[] numbers = {1, 2, 3, 4};\n        int sum = 0;\n        for (int n : numbers) {\n            sum += n;\n        }\n        System.out.println(sum);\n    }\n}",
    expectedOutput: "10",
  },
  {
    title: "Java: реверс строки",
    difficulty: "medium",
    description: "Переверни строку abc. Проверка ожидает cba.",
    starterCode:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println(new StringBuilder("abc").reverse().toString());\n    }\n}',
    expectedOutput: "cba",
  },
  {
    title: "Java: минимум в массиве",
    difficulty: "medium",
    description: "Найди минимум в массиве [5, 2, 9, 1]. Проверка ожидает 1.",
    starterCode:
      "public class Main {\n    public static void main(String[] args) {\n        int[] numbers = {5, 2, 9, 1};\n        int min = numbers[0];\n        for (int n : numbers) {\n            if (n < min) min = n;\n        }\n        System.out.println(min);\n    }\n}",
    expectedOutput: "1",
  },
  {
    title: "Java: количество гласных",
    difficulty: "medium",
    description: "Посчитай количество гласных в слове education. Проверка ожидает 5.",
    starterCode:
      'public class Main {\n    public static void main(String[] args) {\n        String word = "education";\n        int count = 0;\n        for (char ch : word.toCharArray()) {\n            if ("aeiou".indexOf(ch) >= 0) count++;\n        }\n        System.out.println(count);\n    }\n}',
    expectedOutput: "5",
  },
  {
    title: "Java: проверка чётности",
    difficulty: "medium",
    description: "Определи, чётное ли число 8, и выведи even или odd. Проверка ожидает even.",
    starterCode:
      'public class Main {\n    public static void main(String[] args) {\n        int n = 8;\n        System.out.println(n % 2 == 0 ? "even" : "odd");\n    }\n}',
    expectedOutput: "even",
  },
  {
    title: "Java: число Фибоначчи",
    difficulty: "medium",
    description: "Вычисли 7-е число Фибоначчи (последовательность начинается с 0, 1). Проверка ожидает 13.",
    starterCode:
      "public class Main {\n    public static void main(String[] args) {\n        int n = 7;\n        int prev = 0, curr = 1;\n        for (int i = 2; i <= n; i++) {\n            int next = prev + curr;\n            prev = curr;\n            curr = next;\n        }\n        System.out.println(curr);\n    }\n}",
    expectedOutput: "13",
  },
  {
    title: "Java: сумма цифр числа",
    difficulty: "medium",
    description: "Посчитай сумму цифр числа 1234. Проверка ожидает 10.",
    starterCode:
      "public class Main {\n    public static void main(String[] args) {\n        int n = 1234;\n        int sum = 0;\n        while (n > 0) {\n            sum += n % 10;\n            n /= 10;\n        }\n        System.out.println(sum);\n    }\n}",
    expectedOutput: "10",
  },
  {
    title: "Java: сортировка массива",
    difficulty: "medium",
    description: "Отсортируй массив [3, 1, 2] по возрастанию. Проверка ожидает [1, 2, 3].",
    starterCode:
      "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        int[] numbers = {3, 1, 2};\n        Arrays.sort(numbers);\n        System.out.println(Arrays.toString(numbers));\n    }\n}",
    expectedOutput: "[1, 2, 3]",
  },
  {
    title: "Java: проверка палиндрома",
    difficulty: "hard",
    description: "Проверь, является ли строка level палиндромом. Проверка ожидает true.",
    starterCode:
      'public class Main {\n    public static void main(String[] args) {\n        String s = "level";\n        boolean isPalindrome = s.equals(new StringBuilder(s).reverse().toString());\n        System.out.println(isPalindrome);\n    }\n}',
    expectedOutput: "true",
  },
  {
    title: "Java: факториал числа",
    difficulty: "hard",
    description: "Вычисли факториал числа 6. Проверка ожидает 720.",
    starterCode:
      "public class Main {\n    public static void main(String[] args) {\n        int n = 6;\n        long result = 1;\n        for (int i = 2; i <= n; i++) {\n            result *= i;\n        }\n        System.out.println(result);\n    }\n}",
    expectedOutput: "720",
  },
  {
    title: "Java: наибольший общий делитель",
    difficulty: "hard",
    description: "Найди НОД чисел 48 и 18 алгоритмом Евклида. Проверка ожидает 6.",
    starterCode:
      "public class Main {\n    public static void main(String[] args) {\n        int a = 48, b = 18;\n        while (b != 0) {\n            int t = b;\n            b = a % b;\n            a = t;\n        }\n        System.out.println(a);\n    }\n}",
    expectedOutput: "6",
  },
  {
    title: "Java: подсчёт слов",
    difficulty: "hard",
    description: "Посчитай количество слов в строке one two three. Проверка ожидает 3.",
    starterCode:
      'public class Main {\n    public static void main(String[] args) {\n        String text = "one two three";\n        System.out.println(text.split(" ").length);\n    }\n}',
    expectedOutput: "3",
  },
  {
    title: "Java: степень числа",
    difficulty: "hard",
    description: "Вычисли 2 в степени 10. Проверка ожидает 1024.",
    starterCode:
      "public class Main {\n    public static void main(String[] args) {\n        System.out.println((int) Math.pow(2, 10));\n    }\n}",
    expectedOutput: "1024",
  },
];

async function upsertLanguage() {
  const existing = await prisma.language.findFirst({ where: { name: "Java" } });
  const data = {
    name: "Java",
    icon: "☕",
    description:
      "Java - строго типизированный язык для backend-разработки, Android, enterprise-систем и больших надёжных приложений на JVM.",
  };

  if (existing) {
    return prisma.language.update({ where: { id: existing.id }, data });
  }
  return prisma.language.create({ data });
}

async function upsertCategory(languageId, title) {
  const existing = await prisma.category.findFirst({ where: { languageId, title } });
  if (existing) return existing;
  return prisma.category.create({ data: { languageId, title } });
}

async function upsertTopic(categoryId, order, title) {
  return prisma.topic.upsert({
    where: { categoryId_order: { categoryId, order } },
    create: { categoryId, order, title },
    update: { title },
  });
}

async function upsertLesson(topicId, order, data) {
  return prisma.lesson.upsert({
    where: { topicId_order: { topicId, order } },
    create: { topicId, order, title: data.title, content: data.content },
    update: { title: data.title, content: data.content },
  });
}

async function upsertGuide(languageId, data) {
  const payload = { ...data, languageId };
  const existing = await prisma.guide.findFirst({ where: { languageId, title: data.title } });
  if (existing) {
    return prisma.guide.update({ where: { id: existing.id }, data: payload });
  }
  return prisma.guide.create({ data: payload });
}

async function upsertChallenge(languageId, data) {
  const payload = {
    ...data,
    description: `${data.description}\n\nПодсказка: решение проверяется mock-оценкой по expectedOutput, поэтому в ответе должен присутствовать ожидаемый результат.\n\nЧто потренировать: синтаксис Java, вывод через System.out.println, коллекции, методы и базовую работу с классами.`,
    languageId,
  };
  const existing = await prisma.challenge.findFirst({ where: { languageId, title: data.title } });
  if (existing) {
    return prisma.challenge.update({ where: { id: existing.id }, data: payload });
  }
  return prisma.challenge.create({ data: payload });
}

async function main() {
  const java = await upsertLanguage();

  for (const [chapterIndex, chapter] of javaCourse.entries()) {
    const category = await upsertCategory(java.id, chapter.title);

    for (const [topicIndex, topic] of chapter.topics.entries()) {
      const createdTopic = await upsertTopic(category.id, topicIndex + 1, topic.title);

      for (const [lessonIndex, item] of topic.lessons.entries()) {
        await upsertLesson(createdTopic.id, lessonIndex + 1, item);
      }
    }

    if (chapterIndex === javaCourse.length - 1) {
      // Keep the loop variable meaningful for linters while preserving the simple structure.
    }
  }

  for (const guide of guides) {
    await upsertGuide(java.id, guide);
  }

  for (const challenge of challenges) {
    await upsertChallenge(java.id, challenge);
  }

  const [categoryCount, topicCount, lessonCount, guideCount, challengeCount] = await Promise.all([
    prisma.category.count({ where: { languageId: java.id } }),
    prisma.topic.count({ where: { category: { languageId: java.id } } }),
    prisma.lesson.count({ where: { topic: { category: { languageId: java.id } } } }),
    prisma.guide.count({ where: { languageId: java.id } }),
    prisma.challenge.count({ where: { languageId: java.id } }),
  ]);

  console.log(
    `Seeded Java content: ${categoryCount} chapters, ${topicCount} topics, ${lessonCount} lessons, ${guideCount} guides, ${challengeCount} challenges.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
