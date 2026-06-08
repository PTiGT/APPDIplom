const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const lessonDetails = {
  "Что такое Python": `
    <h2>Как работает Python-программа</h2>
    <p>Обычно файл с кодом имеет расширение <code>.py</code>. Интерпретатор Python читает файл сверху вниз и выполняет команды по порядку. Поэтому порядок строк важен: переменную нужно создать до того, как ты её используешь.</p>
    <pre><code># app.py
message = "Python готов"
print(message)</code></pre>
    <h2>Как запускать</h2>
    <pre><code>python app.py
python3 app.py</code></pre>
    <h2>Что запомнить</h2>
    <ul><li>Python хорошо подходит для быстрого старта, но требует аккуратности в структуре проекта.</li><li>Отступы в Python являются частью синтаксиса.</li><li>Ошибки часто читаются сверху вниз: последняя строка traceback обычно показывает главную причину.</li></ul>
    <h2>Практика</h2>
    <p>Создай файл <code>hello.py</code>, выведи своё имя, возраст и одну цель изучения Python.</p>`,
  "Переменные и типы данных": `
    <h2>Динамическая типизация</h2>
    <p>Одна и та же переменная может получить значение другого типа, но злоупотреблять этим не стоит: код становится труднее читать.</p>
    <pre><code>value = 10
value = "десять"  # технически можно, но в реальном коде лучше избегать</code></pre>
    <h2>Преобразование типов</h2>
    <pre><code>age_text = "21"
age = int(age_text)
price = float("19.99")
is_ready = bool(1)</code></pre>
    <h2>Частые ошибки</h2>
    <ul><li><code>"2" + "3"</code> даст строку <code>"23"</code>, а не число <code>5</code>.</li><li><code>input()</code> всегда возвращает строку.</li><li>Для денег лучше не использовать <code>float</code> в серьёзных финансовых расчётах.</li></ul>
    <h2>Практика</h2>
    <p>Создай переменные <code>title</code>, <code>lessons_count</code>, <code>rating</code>, <code>is_published</code> и выведи их типы.</p>`,
  "Условия if / elif / else": `
    <h2>Truthy и falsy</h2>
    <p>В Python некоторые значения считаются ложными: <code>False</code>, <code>None</code>, <code>0</code>, пустая строка, пустой список, пустой словарь.</p>
    <pre><code>name = ""
if not name:
    print("Имя не заполнено")</code></pre>
    <h2>Сравнение</h2>
    <pre><code>temperature = 18
if 15 <= temperature <= 25:
    print("Комфортно")</code></pre>
    <h2>Частые ошибки</h2>
    <ul><li>Не путай <code>=</code> и <code>==</code>: первое присваивает, второе сравнивает.</li><li>Не делай слишком глубокую вложенность <code>if</code>; лучше выделить функцию.</li></ul>
    <h2>Практика</h2>
    <p>Напиши проверку роли пользователя: <code>admin</code>, <code>user</code>, неизвестная роль.</p>`,
  "Циклы for и while": `
    <h2>range подробно</h2>
    <p><code>range(start, stop, step)</code> создаёт последовательность чисел. Значение <code>stop</code> не включается.</p>
    <pre><code>for i in range(2, 10, 2):
    print(i)  # 2, 4, 6, 8</code></pre>
    <h2>enumerate</h2>
    <p>Когда нужен индекс элемента, используй <code>enumerate</code>, а не ручной счётчик.</p>
    <pre><code>names = ["Ann", "Bob"]
for index, name in enumerate(names, start=1):
    print(index, name)</code></pre>
    <h2>Частые ошибки</h2>
    <ul><li>Бесконечный <code>while</code>, если забыть изменить условие.</li><li>Изменение списка во время прохода по нему может дать неожиданный результат.</li></ul>
    <h2>Практика</h2>
    <p>Пройди по списку чисел и выведи только положительные.</p>`,
  "Списки и кортежи": `
    <h2>Методы списков</h2>
    <pre><code>items = ["python", "js"]
items.append("go")
items.insert(1, "java")
items.remove("js")
last = items.pop()</code></pre>
    <h2>Сортировка</h2>
    <pre><code>numbers = [3, 1, 2]
numbers.sort()
print(numbers)

users = [{"name": "Ann", "age": 20}, {"name": "Bob", "age": 18}]
users.sort(key=lambda user: user["age"])</code></pre>
    <h2>Когда tuple лучше list</h2>
    <p>Кортеж подходит для фиксированных пар/наборов значений: координаты, RGB-цвет, диапазон дат. Он показывает намерение: эти данные не должны изменяться.</p>
    <h2>Практика</h2>
    <p>Создай список оценок, найди минимум, максимум и среднее значение.</p>`,
  "Словари и множества": `
    <h2>Проход по словарю</h2>
    <pre><code>user = {"name": "Amir", "role": "admin"}
for key, value in user.items():
    print(key, value)</code></pre>
    <h2>setdefault</h2>
    <p><code>setdefault</code> удобен для группировки.</p>
    <pre><code>words = ["apple", "apricot", "banana"]
groups = {}
for word in words:
    groups.setdefault(word[0], []).append(word)</code></pre>
    <h2>Операции множеств</h2>
    <pre><code>a = {"python", "js"}
b = {"python", "go"}
print(a & b)  # пересечение
print(a | b)  # объединение</code></pre>
    <h2>Практика</h2>
    <p>Посчитай частоту слов в строке через словарь.</p>`,
  "Создание функций": `
    <h2>Возврат значения</h2>
    <p>Функция может печатать результат через <code>print</code>, но для переиспользования лучше возвращать значение через <code>return</code>.</p>
    <pre><code>def calculate_total(price, count):
    return price * count

total = calculate_total(100, 3)</code></pre>
    <h2>*args и **kwargs</h2>
    <pre><code>def show_args(*args, **kwargs):
    print(args)
    print(kwargs)</code></pre>
    <h2>Частые ошибки</h2>
    <ul><li>Слишком много параметров - признак, что нужна структура данных.</li><li>Изменяемые значения по умолчанию вроде <code>[]</code> могут привести к багам.</li></ul>
    <h2>Практика</h2>
    <p>Напиши функцию <code>format_user(name, role="user")</code>, которая возвращает строку с именем и ролью.</p>`,
  "Lambda, map, filter, list comprehension": `
    <h2>Когда comprehension лучше</h2>
    <p>В Python чаще используют list comprehension вместо <code>map</code> и <code>filter</code>, потому что он читается проще.</p>
    <pre><code>numbers = [1, 2, 3, 4]
result = [n * 10 for n in numbers if n % 2 == 0]</code></pre>
    <h2>Dictionary comprehension</h2>
    <pre><code>names = ["Ann", "Bob"]
lengths = {name: len(name) for name in names}</code></pre>
    <h2>Частые ошибки</h2>
    <ul><li>Не делай comprehension слишком длинным.</li><li><code>lambda</code> лучше использовать для коротких выражений, не для сложной логики.</li></ul>
    <h2>Практика</h2>
    <p>Из списка строк оставь только те, где больше трёх символов, и приведи их к верхнему регистру.</p>`,
  "Импорт модулей": `
    <h2>Как Python ищет модули</h2>
    <p>Python ищет модули в текущей папке проекта, установленных пакетах и путях из <code>sys.path</code>.</p>
    <h2>__name__ == "__main__"</h2>
    <p>Этот приём позволяет запускать файл как скрипт и одновременно импортировать его без выполнения лишнего кода.</p>
    <pre><code>def main():
    print("Запуск")

if __name__ == "__main__":
    main()</code></pre>
    <h2>Частые ошибки</h2>
    <ul><li>Называть файл так же, как библиотеку: <code>requests.py</code>, <code>json.py</code>.</li><li>Циклические импорты между файлами.</li></ul>
    <h2>Практика</h2>
    <p>Создай файл <code>math_utils.py</code> с функцией <code>double</code> и импортируй её в <code>main.py</code>.</p>`,
  "Виртуальное окружение и pip": `
    <h2>Активация на разных ОС</h2>
    <pre><code># macOS / Linux
source .venv/bin/activate

# Windows PowerShell
.venv\\Scripts\\Activate.ps1</code></pre>
    <h2>pyproject.toml</h2>
    <p>В современных проектах зависимости часто хранят в <code>pyproject.toml</code>, а не только в <code>requirements.txt</code>. Для старта достаточно понимать оба подхода.</p>
    <h2>Полезные команды</h2>
    <pre><code>pip list
pip show requests
pip uninstall requests</code></pre>
    <h2>Практика</h2>
    <p>Создай окружение, установи <code>requests</code>, выполни простой GET-запрос и сохрани зависимости.</p>`,
  "Исключения try / except": `
    <h2>Лови конкретные ошибки</h2>
    <p>Лучше ловить конкретное исключение, а не писать пустой <code>except</code>. Так ты не спрячешь настоящую проблему.</p>
    <pre><code>try:
    number = int("abc")
except ValueError as error:
    print("Ошибка преобразования:", error)</code></pre>
    <h2>finally</h2>
    <p><code>finally</code> выполняется всегда: удобно для освобождения ресурсов.</p>
    <h2>Собственные классы ошибок</h2>
    <pre><code>class AppError(Exception):
    pass</code></pre>
    <h2>Практика</h2>
    <p>Напиши функцию, которая принимает строку и безопасно возвращает число или <code>None</code>.</p>`,
  "Работа с файлами": `
    <h2>Построчное чтение</h2>
    <pre><code>with open("data.txt", encoding="utf-8") as file:
    for line in file:
        print(line.strip())</code></pre>
    <h2>pathlib</h2>
    <p><code>pathlib</code> даёт объектный и удобный способ работать с путями.</p>
    <pre><code>from pathlib import Path

path = Path("data.txt")
if path.exists():
    print(path.read_text(encoding="utf-8"))</code></pre>
    <h2>Частые ошибки</h2>
    <ul><li>Не указывать <code>encoding="utf-8"</code> для русского текста.</li><li>Открывать файл без <code>with</code> и забывать закрыть.</li></ul>
    <h2>Практика</h2>
    <p>Прочитай текстовый файл, посчитай количество строк и слов.</p>`,
  "Классы и объекты": `
    <h2>Атрибуты объекта и класса</h2>
    <p>Атрибуты объекта принадлежат конкретному экземпляру. Атрибуты класса общие для всех экземпляров.</p>
    <pre><code>class User:
    role = "user"

    def __init__(self, name):
        self.name = name</code></pre>
    <h2>Методы</h2>
    <p>Метод - функция внутри класса. Через <code>self</code> он получает доступ к данным объекта.</p>
    <h2>Частые ошибки</h2>
    <ul><li>Забыть <code>self</code> в методе.</li><li>Делать класс там, где достаточно простой функции.</li></ul>
    <h2>Практика</h2>
    <p>Создай класс <code>Task</code> с полями <code>title</code>, <code>done</code> и методом <code>mark_done</code>.</p>`,
  "Наследование и композиция": `
    <h2>super()</h2>
    <p><code>super()</code> вызывает метод родительского класса.</p>
    <pre><code>class Admin(User):
    def __init__(self, name, permissions):
        super().__init__(name)
        self.permissions = permissions</code></pre>
    <h2>Когда наследование уместно</h2>
    <p>Наследование подходит, когда дочерний класс действительно является разновидностью родительского: <code>Admin</code> является <code>User</code>.</p>
    <h2>Когда лучше композиция</h2>
    <p>Если объект просто использует другой объект, лучше хранить зависимость внутри, а не наследоваться от неё.</p>
    <h2>Практика</h2>
    <p>Смоделируй <code>NotificationService</code>, который использует объект <code>EmailSender</code>.</p>`,
  "Аннотации типов": `
    <h2>Зачем типы в динамическом языке</h2>
    <p>Python не заставляет указывать типы, но аннотации улучшают автодополнение, документацию и проверку через инструменты вроде <code>mypy</code> или <code>pyright</code>.</p>
    <h2>Коллекции</h2>
    <pre><code>users: list[dict[str, str]] = [
    {"name": "Ann"},
]</code></pre>
    <h2>Type alias</h2>
    <pre><code>UserId = int

def load_user(user_id: UserId) -> dict | None:
    return None</code></pre>
    <h2>Практика</h2>
    <p>Добавь типы к функции, которая принимает список чисел и возвращает среднее значение.</p>`,
  Dataclass: `
    <h2>field</h2>
    <p><code>field</code> помогает задавать значения по умолчанию для изменяемых типов.</p>
    <pre><code>from dataclasses import dataclass, field

@dataclass
class Cart:
    items: list[str] = field(default_factory=list)</code></pre>
    <h2>frozen dataclass</h2>
    <p><code>frozen=True</code> делает объект неизменяемым после создания.</p>
    <pre><code>@dataclass(frozen=True)
class Point:
    x: int
    y: int</code></pre>
    <h2>Практика</h2>
    <p>Создай dataclass <code>Lesson</code> с id, title, duration_minutes и completed.</p>`,
  "Итераторы и генераторы": `
    <h2>yield vs return</h2>
    <p><code>return</code> завершает функцию и отдаёт одно значение. <code>yield</code> отдаёт значение и при следующем вызове продолжает выполнение с того же места.</p>
    <h2>Generator expression</h2>
    <pre><code>numbers = (n * n for n in range(1_000_000))
first = next(numbers)</code></pre>
    <h2>Экономия памяти</h2>
    <p>Генератор особенно полезен, когда данных много и не нужно хранить весь список сразу.</p>
    <h2>Практика</h2>
    <p>Напиши генератор, который читает файл построчно и отдаёт только непустые строки.</p>`,
  "Декораторы": `
    <h2>functools.wraps</h2>
    <p>При написании декораторов используй <code>wraps</code>, чтобы сохранить имя и документацию исходной функции.</p>
    <pre><code>from functools import wraps

def log_call(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        print("call", fn.__name__)
        return fn(*args, **kwargs)
    return wrapper</code></pre>
    <h2>Декоратор с параметрами</h2>
    <p>Если декоратору нужны параметры, появляется ещё один уровень вложенности.</p>
    <h2>Практика</h2>
    <p>Сделай декоратор, который измеряет время выполнения функции.</p>`,
  "HTTP-запросы с requests": `
    <h2>Headers и timeout</h2>
    <pre><code>response = requests.get(
    "https://api.github.com",
    headers={"Accept": "application/json"},
    timeout=5,
)</code></pre>
    <h2>Проверка статуса</h2>
    <pre><code>response.raise_for_status()
data = response.json()</code></pre>
    <h2>Частые ошибки</h2>
    <ul><li>Не указывать <code>timeout</code> и получать зависшие запросы.</li><li>Считать, что любой ответ - успешный. Проверяй статус.</li><li>Логировать токены и секреты.</li></ul>
    <h2>Практика</h2>
    <p>Сделай GET-запрос к публичному API и выведи только нужные поля JSON.</p>`,
  "FastAPI: минимальный backend": `
    <h2>Path parameters</h2>
    <pre><code>@app.get("/users/{user_id}")
def get_user(user_id: int):
    return {"id": user_id}</code></pre>
    <h2>Pydantic-модель</h2>
    <pre><code>from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    password: str</code></pre>
    <h2>Почему FastAPI удобен</h2>
    <ul><li>Автоматическая OpenAPI-документация.</li><li>Валидация входных данных.</li><li>Хорошая интеграция с typing.</li></ul>
    <h2>Практика</h2>
    <p>Создай endpoints <code>GET /health</code> и <code>POST /users</code> с Pydantic-моделью.</p>`,
  "JSON и CSV": `
    <h2>pretty JSON</h2>
    <pre><code>print(json.dumps(data, ensure_ascii=False, indent=2))</code></pre>
    <h2>Запись CSV</h2>
    <pre><code>rows = [{"email": "a@example.com"}, {"email": "b@example.com"}]
with open("users.csv", "w", newline="", encoding="utf-8") as file:
    writer = csv.DictWriter(file, fieldnames=["email"])
    writer.writeheader()
    writer.writerows(rows)</code></pre>
    <h2>Частые ошибки</h2>
    <ul><li>Забыть <code>newline=""</code> при работе с CSV.</li><li>Пытаться сериализовать в JSON объекты, которые JSON не поддерживает напрямую.</li></ul>
    <h2>Практика</h2>
    <p>Прочитай CSV пользователей и сохрани выбранные поля в JSON-файл.</p>`,
  "Автоматизация скриптами": `
    <h2>argparse</h2>
    <p><code>argparse</code> позволяет принимать параметры из командной строки.</p>
    <pre><code>import argparse

parser = argparse.ArgumentParser()
parser.add_argument("--name", required=True)
args = parser.parse_args()
print(args.name)</code></pre>
    <h2>logging</h2>
    <p>Для реальных скриптов лучше использовать <code>logging</code>, а не только <code>print</code>.</p>
    <h2>Практика</h2>
    <p>Напиши скрипт, который принимает путь к папке и выводит количество файлов по расширениям.</p>`,
  pytest: `
    <h2>Arrange, Act, Assert</h2>
    <p>Хороший тест обычно состоит из подготовки данных, действия и проверки результата.</p>
    <pre><code>def test_discount():
    price = 100
    result = apply_discount(price, 10)
    assert result == 90</code></pre>
    <h2>parametrize</h2>
    <pre><code>import pytest

@pytest.mark.parametrize("a,b,expected", [(2, 3, 5), (1, 1, 2)])
def test_add(a, b, expected):
    assert add(a, b) == expected</code></pre>
    <h2>Практика</h2>
    <p>Покрой тестами функцию, которая валидирует email.</p>`,
  "Стиль кода": `
    <h2>PEP 8</h2>
    <p>PEP 8 - базовый стиль Python-кода: имена переменных в <code>snake_case</code>, классы в <code>PascalCase</code>, понятные отступы и пробелы.</p>
    <h2>ruff</h2>
    <p><code>ruff</code> быстро находит неиспользуемые импорты, потенциальные ошибки и нарушения стиля.</p>
    <h2>Структура проекта</h2>
    <pre><code>project/
  src/
    app/
      __init__.py
      main.py
  tests/
  pyproject.toml</code></pre>
    <h2>Практика</h2>
    <p>Возьми небольшой файл, отформатируй его через <code>black</code> и проверь через <code>ruff</code>.</p>`,
};

function lesson(title, content) {
  return {
    title,
    content: `${content}${lessonDetails[title] ?? ""}`,
  };
}

const pythonCourse = [
  {
    title: "Основы Python",
    topics: [
      {
        title: "Синтаксис и запуск",
        lessons: [
          lesson(
            "Что такое Python",
            `<h2>Python как язык</h2>
            <p>Python - высокоуровневый язык программирования с простым синтаксисом. Его используют для backend-разработки, автоматизации, анализа данных, машинного обучения, скриптов и тестирования.</p>
            <h2>Где применяется</h2>
            <ul><li>Веб-приложения: Django, FastAPI, Flask.</li><li>Data Science: pandas, NumPy, scikit-learn.</li><li>Автоматизация: скрипты, парсеры, обработка файлов.</li><li>Тестирование: pytest, unittest.</li></ul>
            <h2>Минимальная программа</h2>
            <pre><code>print("Hello, Python!")</code></pre>`,
          ),
          lesson(
            "Переменные и типы данных",
            `<h2>Переменные</h2>
            <p>В Python переменная создаётся при первом присваивании. Тип указывать не нужно: интерпретатор определяет его во время выполнения.</p>
            <pre><code>name = "Amir"
age = 21
price = 19.99
is_active = True</code></pre>
            <h2>Основные типы</h2>
            <ul><li><code>str</code> - строки.</li><li><code>int</code> - целые числа.</li><li><code>float</code> - дробные числа.</li><li><code>bool</code> - логические значения.</li><li><code>None</code> - отсутствие значения.</li></ul>
            <h2>Проверка типа</h2>
            <pre><code>print(type(age))
print(isinstance(name, str))</code></pre>`,
          ),
        ],
      },
      {
        title: "Условия и циклы",
        lessons: [
          lesson(
            "Условия if / elif / else",
            `<h2>Условные конструкции</h2>
            <p>Условия позволяют выполнять разный код в зависимости от значения выражения.</p>
            <pre><code>score = 87

if score >= 90:
    print("Отлично")
elif score >= 70:
    print("Хорошо")
else:
    print("Нужно повторить")</code></pre>
            <h2>Логические операторы</h2>
            <p>Используй <code>and</code>, <code>or</code>, <code>not</code> для составных проверок.</p>
            <pre><code>age = 20
has_ticket = True

if age >= 18 and has_ticket:
    print("Можно войти")</code></pre>`,
          ),
          lesson(
            "Циклы for и while",
            `<h2>Цикл for</h2>
            <p><code>for</code> удобен, когда нужно пройти по коллекции или диапазону чисел.</p>
            <pre><code>for i in range(5):
    print(i)

names = ["Ann", "Bob", "Kate"]
for name in names:
    print(name)</code></pre>
            <h2>Цикл while</h2>
            <p><code>while</code> работает, пока условие истинно.</p>
            <pre><code>count = 3
while count > 0:
    print(count)
    count -= 1</code></pre>
            <h2>break и continue</h2>
            <p><code>break</code> завершает цикл, <code>continue</code> переходит к следующей итерации.</p>`,
          ),
        ],
      },
      {
        title: "Коллекции",
        lessons: [
          lesson(
            "Списки и кортежи",
            `<h2>Список</h2>
            <p>Список хранит упорядоченный набор элементов и может изменяться.</p>
            <pre><code>numbers = [1, 2, 3]
numbers.append(4)
print(numbers[0])
print(numbers[-1])</code></pre>
            <h2>Срезы</h2>
            <pre><code>items = [10, 20, 30, 40, 50]
print(items[1:4])
print(items[:3])
print(items[::2])</code></pre>
            <h2>Кортеж</h2>
            <p>Кортеж похож на список, но не изменяется после создания.</p>
            <pre><code>point = (10, 20)</code></pre>`,
          ),
          lesson(
            "Словари и множества",
            `<h2>Словарь</h2>
            <p>Словарь хранит пары ключ-значение. Это одна из самых важных структур данных в Python.</p>
            <pre><code>user = {
    "name": "Amir",
    "role": "admin",
}

print(user["name"])
user["active"] = True</code></pre>
            <h2>Безопасное чтение</h2>
            <pre><code>theme = user.get("theme", "dark")</code></pre>
            <h2>Множество</h2>
            <p>Множество хранит уникальные значения.</p>
            <pre><code>tags = {"python", "backend", "python"}
print(tags)</code></pre>`,
          ),
        ],
      },
    ],
  },
  {
    title: "Функции и модули",
    topics: [
      {
        title: "Функции",
        lessons: [
          lesson(
            "Создание функций",
            `<h2>Зачем нужны функции</h2>
            <p>Функции позволяют переиспользовать код и разбивать программу на понятные части.</p>
            <pre><code>def greet(name):
    return f"Привет, {name}!"

message = greet("Amir")
print(message)</code></pre>
            <h2>Аргументы по умолчанию</h2>
            <pre><code>def power(value, exponent=2):
    return value ** exponent</code></pre>
            <h2>Именованные аргументы</h2>
            <pre><code>print(power(value=3, exponent=3))</code></pre>`,
          ),
          lesson(
            "Lambda, map, filter, list comprehension",
            `<h2>List comprehension</h2>
            <p>Короткий способ создать список на основе другого списка.</p>
            <pre><code>numbers = [1, 2, 3, 4]
squares = [n * n for n in numbers]</code></pre>
            <h2>Фильтрация</h2>
            <pre><code>even = [n for n in numbers if n % 2 == 0]</code></pre>
            <h2>Lambda</h2>
            <p><code>lambda</code> создаёт маленькую анонимную функцию.</p>
            <pre><code>users = [{"name": "Ann", "age": 20}, {"name": "Bob", "age": 18}]
users.sort(key=lambda user: user["age"])</code></pre>`,
          ),
        ],
      },
      {
        title: "Модули и пакеты",
        lessons: [
          lesson(
            "Импорт модулей",
            `<h2>Импорт</h2>
            <p>Модуль - это файл Python. Его можно импортировать в другой файл.</p>
            <pre><code>import math

print(math.sqrt(16))</code></pre>
            <h2>Импорт конкретных объектов</h2>
            <pre><code>from datetime import datetime

print(datetime.now())</code></pre>
            <h2>Собственный модуль</h2>
            <p>Если есть файл <code>utils.py</code>, его функции можно импортировать через <code>import utils</code> или <code>from utils import name</code>.</p>`,
          ),
          lesson(
            "Виртуальное окружение и pip",
            `<h2>Зачем virtualenv</h2>
            <p>Виртуальное окружение изолирует зависимости проекта. Так разные проекты могут использовать разные версии библиотек.</p>
            <pre><code>python -m venv .venv
source .venv/bin/activate
pip install requests</code></pre>
            <h2>requirements.txt</h2>
            <pre><code>pip freeze > requirements.txt
pip install -r requirements.txt</code></pre>
            <h2>Правило</h2>
            <p>Не коммить папку <code>.venv</code> в репозиторий. Коммить нужно список зависимостей.</p>`,
          ),
        ],
      },
      {
        title: "Ошибки и файлы",
        lessons: [
          lesson(
            "Исключения try / except",
            `<h2>Обработка ошибок</h2>
            <p>Исключения позволяют обработать ситуацию, когда код не может выполниться нормально.</p>
            <pre><code>try:
    value = int("123")
except ValueError:
    print("Это не число")
else:
    print("Успешно")
finally:
    print("Завершено")</code></pre>
            <h2>Собственное исключение</h2>
            <pre><code>raise ValueError("Некорректное значение")</code></pre>`,
          ),
          lesson(
            "Работа с файлами",
            `<h2>Чтение файла</h2>
            <pre><code>with open("data.txt", "r", encoding="utf-8") as file:
    content = file.read()</code></pre>
            <h2>Запись файла</h2>
            <pre><code>with open("result.txt", "w", encoding="utf-8") as file:
    file.write("Готово")</code></pre>
            <h2>Почему with</h2>
            <p><code>with</code> автоматически закрывает файл даже при ошибке.</p>`,
          ),
        ],
      },
    ],
  },
  {
    title: "Объектно-ориентированный Python",
    topics: [
      {
        title: "Классы",
        lessons: [
          lesson(
            "Классы и объекты",
            `<h2>Класс</h2>
            <p>Класс описывает структуру объекта: данные и методы.</p>
            <pre><code>class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email

    def greet(self):
        return f"Привет, {self.name}"

user = User("Amir", "amir@example.com")
print(user.greet())</code></pre>
            <h2>self</h2>
            <p><code>self</code> - ссылка на текущий объект.</p>`,
          ),
          lesson(
            "Наследование и композиция",
            `<h2>Наследование</h2>
            <pre><code>class Animal:
    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):
        return "woof"</code></pre>
            <h2>Композиция</h2>
            <p>Композиция часто проще наследования: объект хранит другой объект внутри себя.</p>
            <pre><code>class Service:
    def __init__(self, repository):
        self.repository = repository</code></pre>
            <p>Для прикладного кода чаще выбирай композицию, если нет явной иерархии типов.</p>`,
          ),
        ],
      },
      {
        title: "Dataclasses и typing",
        lessons: [
          lesson(
            "Аннотации типов",
            `<h2>Typing</h2>
            <p>Аннотации типов делают код понятнее и помогают IDE находить ошибки.</p>
            <pre><code>def add(a: int, b: int) -> int:
    return a + b

names: list[str] = ["Ann", "Bob"]</code></pre>
            <h2>Optional</h2>
            <pre><code>def find_user(id: int) -> dict | None:
    return None</code></pre>`,
          ),
          lesson(
            "Dataclass",
            `<h2>Dataclass</h2>
            <p><code>dataclass</code> быстро создаёт классы для хранения данных.</p>
            <pre><code>from dataclasses import dataclass

@dataclass
class Product:
    id: int
    title: str
    price: float

product = Product(1, "Book", 12.5)</code></pre>
            <p>Dataclass автоматически создаёт <code>__init__</code>, <code>__repr__</code> и сравнение объектов.</p>`,
          ),
        ],
      },
      {
        title: "Итераторы и декораторы",
        lessons: [
          lesson(
            "Итераторы и генераторы",
            `<h2>Генератор</h2>
            <p>Генератор возвращает значения постепенно и не хранит весь результат в памяти.</p>
            <pre><code>def countdown(n):
    while n > 0:
        yield n
        n -= 1

for value in countdown(3):
    print(value)</code></pre>
            <h2>Когда использовать</h2>
            <p>Генераторы полезны для больших файлов, потоков данных и ленивых вычислений.</p>`,
          ),
          lesson(
            "Декораторы",
            `<h2>Идея декоратора</h2>
            <p>Декоратор оборачивает функцию и добавляет поведение до или после вызова.</p>
            <pre><code>def log_call(fn):
    def wrapper(*args, **kwargs):
        print("call", fn.__name__)
        return fn(*args, **kwargs)
    return wrapper

@log_call
def hello():
    print("hello")</code></pre>
            <p>Декораторы часто используют в web-фреймворках, тестах, кешировании и логировании.</p>`,
          ),
        ],
      },
    ],
  },
  {
    title: "Практический Python",
    topics: [
      {
        title: "Web и API",
        lessons: [
          lesson(
            "HTTP-запросы с requests",
            `<h2>requests</h2>
            <p><code>requests</code> - популярная библиотека для HTTP-запросов.</p>
            <pre><code>import requests

response = requests.get("https://api.github.com")
print(response.status_code)
print(response.json())</code></pre>
            <h2>POST-запрос</h2>
            <pre><code>payload = {"email": "user@example.com"}
response = requests.post("https://example.com/api", json=payload)</code></pre>`,
          ),
          lesson(
            "FastAPI: минимальный backend",
            `<h2>FastAPI</h2>
            <p>FastAPI - современный фреймворк для создания API на Python.</p>
            <pre><code>from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health():
    return {"ok": True}</code></pre>
            <h2>Запуск</h2>
            <pre><code>pip install fastapi uvicorn
uvicorn main:app --reload</code></pre>`,
          ),
        ],
      },
      {
        title: "Данные и автоматизация",
        lessons: [
          lesson(
            "JSON и CSV",
            `<h2>JSON</h2>
            <pre><code>import json

data = {"name": "Python", "level": "beginner"}
text = json.dumps(data, ensure_ascii=False)
parsed = json.loads(text)</code></pre>
            <h2>CSV</h2>
            <pre><code>import csv

with open("users.csv", newline="", encoding="utf-8") as file:
    reader = csv.DictReader(file)
    for row in reader:
        print(row["email"])</code></pre>`,
          ),
          lesson(
            "Автоматизация скриптами",
            `<h2>Что автоматизировать</h2>
            <ul><li>Переименование файлов.</li><li>Обработку отчётов.</li><li>Проверку доступности сайтов.</li><li>Сбор простых данных из API.</li></ul>
            <h2>Пример pathlib</h2>
            <pre><code>from pathlib import Path

for file in Path(".").glob("*.txt"):
    print(file.name)</code></pre>
            <p><code>pathlib</code> удобнее строковых путей и работает кроссплатформенно.</p>`,
          ),
        ],
      },
      {
        title: "Тестирование и качество",
        lessons: [
          lesson(
            "pytest",
            `<h2>Зачем тесты</h2>
            <p>Тесты помогают менять код без страха сломать старое поведение.</p>
            <pre><code>def add(a, b):
    return a + b

def test_add():
    assert add(2, 3) == 5</code></pre>
            <h2>Запуск</h2>
            <pre><code>pip install pytest
pytest</code></pre>`,
          ),
          lesson(
            "Стиль кода",
            `<h2>Форматирование</h2>
            <p>Для форматирования часто используют <code>black</code>, для линтинга - <code>ruff</code>.</p>
            <pre><code>pip install black ruff
black .
ruff check .</code></pre>
            <h2>Практики</h2>
            <ul><li>Называй переменные понятно.</li><li>Разделяй большие функции.</li><li>Не скрывай ошибки пустым <code>except</code>.</li><li>Пиши тесты на важную бизнес-логику.</li></ul>`,
          ),
        ],
      },
    ],
  },
];

const guides = [
  {
    title: "Стандартная библиотека Python",
    content: `<h2>Что входит</h2><p>Python поставляется с большой стандартной библиотекой. Она покрывает файлы, JSON, даты, HTTP, тестирование, логирование, потоки, процессы и многое другое.</p><ul><li><code>datetime</code> - дата и время.</li><li><code>pathlib</code> - работа с путями.</li><li><code>json</code> - JSON.</li><li><code>csv</code> - CSV-файлы.</li><li><code>sqlite3</code> - встроенная база данных.</li><li><code>unittest</code> - тестирование.</li></ul>`,
  },
  {
    title: "Backend на Python",
    content: `<h2>Фреймворки</h2><ul><li><strong>FastAPI</strong> - быстрый современный API, удобно работает с типами.</li><li><strong>Django</strong> - большой фреймворк с ORM, админкой и auth.</li><li><strong>Flask</strong> - минималистичный фреймворк для небольших сервисов.</li></ul><h2>Что изучить</h2><p>HTTP, REST, валидацию данных, ORM, миграции, JWT/session auth, тестирование API.</p>`,
  },
  {
    title: "Data Science библиотеки",
    content: `<h2>Основной стек</h2><ul><li><code>NumPy</code> - массивы и численные вычисления.</li><li><code>pandas</code> - таблицы и анализ данных.</li><li><code>matplotlib</code> и <code>seaborn</code> - графики.</li><li><code>scikit-learn</code> - классическое машинное обучение.</li></ul><p>Для старта достаточно уверенно знать списки, словари, функции, файлы и виртуальные окружения.</p>`,
  },
  {
    title: "Автоматизация на Python",
    content: `<h2>Типичные задачи</h2><ul><li>Скрипты для файлов и папок.</li><li>Парсинг JSON/CSV.</li><li>Запросы к API.</li><li>Генерация отчётов.</li><li>Проверка сайтов и сервисов.</li></ul><h2>Полезные модули</h2><p><code>pathlib</code>, <code>requests</code>, <code>csv</code>, <code>json</code>, <code>argparse</code>, <code>logging</code>.</p>`,
  },
  {
    title: "Инструменты Python-разработчика",
    content: `<h2>Минимальный набор</h2><ul><li><code>venv</code> - виртуальные окружения.</li><li><code>pip</code> - установка пакетов.</li><li><code>pytest</code> - тесты.</li><li><code>black</code> - форматирование.</li><li><code>ruff</code> - быстрый линтер.</li><li><code>mypy</code> - проверка типов.</li></ul><p>Для командной разработки добавь pre-commit hooks и CI-проверки.</p>`,
  },
];

const guideDetails = {
  "Стандартная библиотека Python": `<h2>Как выбирать модуль</h2><p>Перед установкой внешней библиотеки проверь стандартную библиотеку: часто нужная возможность уже есть в Python. Это уменьшает зависимости и упрощает деплой.</p><h2>Практические сценарии</h2><ul><li><code>pathlib</code> для обхода папок и проверки файлов.</li><li><code>datetime</code> для дат, дедлайнов и расписаний.</li><li><code>json</code> и <code>csv</code> для обмена данными.</li><li><code>logging</code> для нормальных логов вместо хаотичных <code>print</code>.</li></ul><h2>Мини-проект</h2><p>Сделай скрипт, который читает CSV с пользователями, валидирует email и сохраняет результат в JSON.</p>`,
  "Backend на Python": `<h2>Типовая архитектура API</h2><ul><li>routes/controllers принимают HTTP-запрос.</li><li>services содержат бизнес-логику.</li><li>repositories работают с базой данных.</li><li>schemas валидируют входные и выходные данные.</li></ul><h2>Что важно знать</h2><p>Для backend-разработки на Python нужно понимать HTTP-методы, статус-коды, JSON, CORS, авторизацию, миграции БД и тестирование endpoints.</p><h2>Мини-проект</h2><p>Сделай API задач: создать задачу, получить список, отметить задачу выполненной, удалить задачу.</p>`,
  "Data Science библиотеки": `<h2>Как выглядит пайплайн</h2><ol><li>Загрузить данные.</li><li>Очистить пропуски и неправильные значения.</li><li>Посмотреть статистику и графики.</li><li>Подготовить признаки.</li><li>Обучить модель или сделать отчёт.</li></ol><h2>Что выучить перед pandas</h2><p>Списки, словари, функции, файлы, list comprehension, виртуальные окружения. Без этих основ pandas будет казаться магией.</p><h2>Мини-проект</h2><p>Возьми CSV с продажами, посчитай сумму по категориям и выведи топ-5 товаров.</p>`,
  "Автоматизация на Python": `<h2>Как проектировать скрипт</h2><ul><li>Вынеси настройки в аргументы командной строки или env.</li><li>Пиши функции вместо одного большого файла.</li><li>Добавь логирование и понятные сообщения об ошибках.</li><li>Сначала сделай dry-run режим, если скрипт меняет файлы.</li></ul><h2>Опасные места</h2><p>Будь осторожен с удалением файлов, массовым переименованием и запросами к внешним сервисам без ограничений.</p><h2>Мини-проект</h2><p>Сделай сортировщик папки Downloads: картинки в одну папку, документы в другую, архивы в третью.</p>`,
  "Инструменты Python-разработчика": `<h2>Рекомендуемый workflow</h2><ol><li>Создать виртуальное окружение.</li><li>Установить зависимости.</li><li>Настроить форматирование и линтинг.</li><li>Написать тесты.</li><li>Запускать проверки перед commit.</li></ol><h2>Команды</h2><pre><code>python -m venv .venv
source .venv/bin/activate
pip install pytest black ruff
black .
ruff check .
pytest</code></pre><h2>Мини-проект</h2><p>Настрой маленький проект с папками <code>src</code> и <code>tests</code>, добавь форматирование, линтер и пару тестов.</p>`,
};

const challenges = [
  {
    title: "Python: сумма двух чисел",
    difficulty: "easy",
    description: "Напиши выражение или код, который выводит сумму 2 и 3. Для успешной проверки в ответе должен быть результат 5.",
    starterCode: 'print(2 + 3)',
    expectedOutput: "5",
  },
  {
    title: "Python: приветствие",
    difficulty: "easy",
    description: "Создай строку приветствия для имени Amir. Проверка ожидает текст: Привет, Amir!",
    starterCode: 'name = "Amir"\nprint(f"Привет, {name}!")',
    expectedOutput: "Привет, Amir!",
  },
  {
    title: "Python: чётные числа",
    difficulty: "easy",
    description: "Отфильтруй чётные числа из списка [1, 2, 3, 4, 5, 6]. Проверка ожидает [2, 4, 6].",
    starterCode: "numbers = [1, 2, 3, 4, 5, 6]\neven = [n for n in numbers if n % 2 == 0]\nprint(even)",
    expectedOutput: "[2, 4, 6]",
  },
  {
    title: "Python: частота слов",
    difficulty: "medium",
    description: "Посчитай количество слов python в списке ['python', 'js', 'python', 'go']. Проверка ожидает 2.",
    starterCode: "words = ['python', 'js', 'python', 'go']\nprint(words.count('python'))",
    expectedOutput: "2",
  },
  {
    title: "Python: словарь пользователя",
    difficulty: "medium",
    description: "Создай словарь пользователя и выведи email. Проверка ожидает amir@example.com.",
    starterCode: "user = {'name': 'Amir', 'email': 'amir@example.com'}\nprint(user['email'])",
    expectedOutput: "amir@example.com",
  },
  {
    title: "Python: функция factorial",
    difficulty: "medium",
    description: "Напиши функцию factorial и выведи factorial(5). Проверка ожидает 120.",
    starterCode: "def factorial(n):\n    result = 1\n    for value in range(2, n + 1):\n        result *= value\n    return result\n\nprint(factorial(5))",
    expectedOutput: "120",
  },
  {
    title: "Python: генератор квадратов",
    difficulty: "hard",
    description: "Сгенерируй квадраты чисел от 1 до 5. Проверка ожидает [1, 4, 9, 16, 25].",
    starterCode: "squares = [n * n for n in range(1, 6)]\nprint(squares)",
    expectedOutput: "[1, 4, 9, 16, 25]",
  },
  {
    title: "Python: группировка по первой букве",
    difficulty: "hard",
    description: "Сгруппируй слова ['apple', 'apricot', 'banana'] по первой букве. Проверка ожидает {'a': ['apple', 'apricot'], 'b': ['banana']}.",
    starterCode:
      "words = ['apple', 'apricot', 'banana']\ngroups = {}\nfor word in words:\n    groups.setdefault(word[0], []).append(word)\nprint(groups)",
    expectedOutput: "{'a': ['apple', 'apricot'], 'b': ['banana']}",
  },
  {
    title: "Python: произведение чисел",
    difficulty: "easy",
    description: "Выведи произведение 6 и 7. Проверка ожидает 42.",
    starterCode: "print(6 * 7)",
    expectedOutput: "42",
  },
  {
    title: "Python: разность чисел",
    difficulty: "easy",
    description: "Выведи разность 20 и 8. Проверка ожидает 12.",
    starterCode: "print(20 - 8)",
    expectedOutput: "12",
  },
  {
    title: "Python: верхний регистр",
    difficulty: "easy",
    description: "Приведи строку python к верхнему регистру. Проверка ожидает PYTHON.",
    starterCode: 'print("python".upper())',
    expectedOutput: "PYTHON",
  },
  {
    title: "Python: длина строки",
    difficulty: "easy",
    description: "Выведи длину строки Hello. Проверка ожидает 5.",
    starterCode: 'print(len("Hello"))',
    expectedOutput: "5",
  },
  {
    title: "Python: остаток от деления",
    difficulty: "easy",
    description: "Выведи остаток от деления 17 на 5. Проверка ожидает 2.",
    starterCode: "print(17 % 5)",
    expectedOutput: "2",
  },
  {
    title: "Python: логическое сравнение",
    difficulty: "easy",
    description: "Проверь, что 7 больше 3, и выведи результат. Проверка ожидает True.",
    starterCode: "print(7 > 3)",
    expectedOutput: "True",
  },
  {
    title: "Python: конкатенация строк",
    difficulty: "easy",
    description: "Склей строки Py и thon. Проверка ожидает Python.",
    starterCode: 'print("Py" + "thon")',
    expectedOutput: "Python",
  },
  {
    title: "Python: сумма списка",
    difficulty: "medium",
    description: "Посчитай сумму элементов списка [1, 2, 3, 4]. Проверка ожидает 10.",
    starterCode: "print(sum([1, 2, 3, 4]))",
    expectedOutput: "10",
  },
  {
    title: "Python: реверс строки",
    difficulty: "medium",
    description: "Переверни строку abc через срез. Проверка ожидает cba.",
    starterCode: 'print("abc"[::-1])',
    expectedOutput: "cba",
  },
  {
    title: "Python: минимум в списке",
    difficulty: "medium",
    description: "Найди минимум в списке [5, 2, 9, 1]. Проверка ожидает 1.",
    starterCode: "print(min([5, 2, 9, 1]))",
    expectedOutput: "1",
  },
  {
    title: "Python: количество гласных",
    difficulty: "medium",
    description: "Посчитай количество гласных в слове education. Проверка ожидает 5.",
    starterCode: 'word = "education"\nprint(sum(1 for ch in word if ch in "aeiou"))',
    expectedOutput: "5",
  },
  {
    title: "Python: проверка чётности",
    difficulty: "medium",
    description: "Определи, чётное ли число 8, и выведи even или odd. Проверка ожидает even.",
    starterCode: 'n = 8\nprint("even" if n % 2 == 0 else "odd")',
    expectedOutput: "even",
  },
  {
    title: "Python: число Фибоначчи",
    difficulty: "medium",
    description: "Вычисли 7-е число Фибоначчи (последовательность начинается с 0, 1). Проверка ожидает 13.",
    starterCode: "a, b = 0, 1\nfor _ in range(7):\n    a, b = b, a + b\nprint(a)",
    expectedOutput: "13",
  },
  {
    title: "Python: сумма цифр числа",
    difficulty: "medium",
    description: "Посчитай сумму цифр числа 1234. Проверка ожидает 10.",
    starterCode: "print(sum(int(d) for d in str(1234)))",
    expectedOutput: "10",
  },
  {
    title: "Python: сортировка списка",
    difficulty: "medium",
    description: "Отсортируй список [3, 1, 2] по возрастанию. Проверка ожидает [1, 2, 3].",
    starterCode: "print(sorted([3, 1, 2]))",
    expectedOutput: "[1, 2, 3]",
  },
  {
    title: "Python: проверка палиндрома",
    difficulty: "hard",
    description: "Проверь, является ли строка level палиндромом. Проверка ожидает True.",
    starterCode: 's = "level"\nprint(s == s[::-1])',
    expectedOutput: "True",
  },
  {
    title: "Python: факториал числа",
    difficulty: "hard",
    description: "Вычисли факториал числа 6. Проверка ожидает 720.",
    starterCode: "import math\nprint(math.factorial(6))",
    expectedOutput: "720",
  },
  {
    title: "Python: наибольший общий делитель",
    difficulty: "hard",
    description: "Найди НОД чисел 48 и 18. Проверка ожидает 6.",
    starterCode: "import math\nprint(math.gcd(48, 18))",
    expectedOutput: "6",
  },
  {
    title: "Python: подсчёт слов",
    difficulty: "hard",
    description: "Посчитай количество слов в строке one two three. Проверка ожидает 3.",
    starterCode: 'print(len("one two three".split()))',
    expectedOutput: "3",
  },
  {
    title: "Python: степень числа",
    difficulty: "hard",
    description: "Вычисли 2 в степени 10. Проверка ожидает 1024.",
    starterCode: "print(2 ** 10)",
    expectedOutput: "1024",
  },
];

async function upsertLanguage() {
  const existing = await prisma.language.findFirst({ where: { name: "Python" } });
  const data = {
    name: "Python",
    icon: "🐍",
    description:
      "Python - универсальный язык для backend-разработки, автоматизации, анализа данных, машинного обучения, тестирования и быстрых скриптов.",
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
  const payload = {
    ...data,
    content: `${data.content}${guideDetails[data.title] ?? ""}`,
    languageId,
  };
  const existing = await prisma.guide.findFirst({ where: { languageId, title: data.title } });
  if (existing) {
    return prisma.guide.update({ where: { id: existing.id }, data: payload });
  }
  return prisma.guide.create({ data: payload });
}

async function upsertChallenge(languageId, data) {
  const payload = {
    ...data,
    description: `${data.description}\n\nПодсказка: решение проверяется mock-оценкой по expectedOutput, поэтому в ответе должен присутствовать ожидаемый результат.\n\nЧто потренировать: синтаксис Python, вывод через print, работу с базовыми структурами данных и аккуратное чтение условия.`,
    languageId,
  };
  const existing = await prisma.challenge.findFirst({ where: { languageId, title: data.title } });
  if (existing) {
    return prisma.challenge.update({ where: { id: existing.id }, data: payload });
  }
  return prisma.challenge.create({ data: payload });
}

async function main() {
  const python = await upsertLanguage();

  for (const [chapterIndex, chapter] of pythonCourse.entries()) {
    const category = await upsertCategory(python.id, chapter.title);

    for (const [topicIndex, topic] of chapter.topics.entries()) {
      const createdTopic = await upsertTopic(category.id, topicIndex + 1, topic.title);

      for (const [lessonIndex, item] of topic.lessons.entries()) {
        await upsertLesson(createdTopic.id, lessonIndex + 1, item);
      }
    }
  }

  for (const guide of guides) {
    await upsertGuide(python.id, guide);
  }

  for (const challenge of challenges) {
    await upsertChallenge(python.id, challenge);
  }

  const [categoryCount, topicCount, lessonCount, guideCount, challengeCount] = await Promise.all([
    prisma.category.count({ where: { languageId: python.id } }),
    prisma.topic.count({ where: { category: { languageId: python.id } } }),
    prisma.lesson.count({ where: { topic: { category: { languageId: python.id } } } }),
    prisma.guide.count({ where: { languageId: python.id } }),
    prisma.challenge.count({ where: { languageId: python.id } }),
  ]);

  console.log(
    `Seeded Python content: ${categoryCount} chapters, ${topicCount} topics, ${lessonCount} lessons, ${guideCount} guides, ${challengeCount} challenges.`,
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
