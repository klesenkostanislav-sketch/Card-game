# 🔍 Отладка отображения карт

## Проблема
Карты не отображаются на экране, области руки пустые.

## ✅ Примененные исправления

### 1. Добавлена детальная отладочная информация в `ui/renderer.js`
- Логи при инициализации элементов DOM
- Логи при каждом вызове `render()`
- Логи при создании каждого элемента карты
- Проверки на null/undefined с понятными сообщениями об ошибках

### 2. Улучшена обработка ошибок
- Явные проверки контейнера руки перед рендерингом
- Визуальные сообщения об ошибках прямо в области руки
- Логирование каждой playable/unplayable карты

### 3. Добавлены debug-страницы

#### Вариант A: Основная игра с логами
Откройте http://localhost:8080 и откройте консоль браузера (F12)

Ожидаемые логи:
```
🔍 UI Renderer: Starting initialization...
✅ player-hand element found
✅ opponent-hand element found
✅ UI Renderer initialized. Total elements cached: 19
🎴 Game Engine: Initializing...
✅ Game Engine: Game started, state: {...}
📢 Game Engine: Notifying state change...
📡 Calling onStateChanged callback
🎨 render() called with state: {...}
🃏 renderHand called: { handSize: 4, ... }
🎴 Creating card element: { name: "Arcane Bolt", ... }
✅ Card element created for "Arcane Bolt"
✅ Rendered 4 cards to player hand
```

#### Вариант B: Debug страница с оверлеем
Откройте http://localhost:8080/debug.html

Справа будет панель реального времени показывающая:
- Статус игры
- HP/Mana игроков  
- Количество карт в руке и колоде
- Названия карт в руке
- Какие DOM элементы найдены

#### Вариант C: Тестовая страница
Откройте http://localhost:8080/test_game.html

Показывает базовую работу CSS и создание карт

## 🐛 Что искать в консоли

### Критические ошибки (красные):
- `❌ CRITICAL: player-hand element NOT found in DOM!` → Проблема в HTML
- `❌ CRITICAL: Player or player.hand is undefined!` → Проблема в state.js
- `❌ Cannot render: invalid state` → Игра не инициализировалась

### Предупреждения (желтые):
- `⚠️ No onStateChanged callback registered!` → Проблема в main.js
- `⚠️ Player hand is empty` → Нормально если колода пуста

### Успешные логи (зеленые/синие):
- `✅ player-hand element found` → DOM найден
- `✅ Card element created` → Карта создана
- `✅ Rendered X cards to player hand` → Рендер успешен

## 🧪 Ручная проверка в консоли браузера

Откройте консоль (F12) на http://localhost:8080 и выполните:

```javascript
// 1. Проверка DOM
document.getElementById('player-hand') // Должен вернуть div

// 2. Проверка игры
window.mysticRealms.state.players.human.hand // Массив карт

// 3. Принудительный ререндер
window.mysticRealms.renderer.render(window.mysticRealms.state)
```

## 📋 Чеклист диагностики

1. [ ] Сервер запущен на порту 8080
2. [ ] Браузер загружает index.html (не файл с диска!)
3. [ ] В консоли нет ошибок CORS или 404
4. [ ] Элемент #player-hand существует в DOM
5. [ ] window.mysticRealms определен после загрузки
6. [ ] state.players.human.hand содержит 4 карты
7. [ ] Вызывается render() с правильным state

## 💡 Возможные причины проблемы

### Если элемент player-hand не найден:
- HTML файл не загружается правильно
- Опечатка в id элемента
- Script выполняется до загрузки DOM

### Если state.players.human.hand пуст:
- Ошибка в createDeck() или drawCard()
- startGame() не вызывается
- Модуль cards.js не загружается

### Если render() не вызывается:
- Callback onStateChanged не зарегистрирован
- Engine не вызывает notifyStateChanged()
- Ошибка до инициализации игры

## 📞 Следующие шаги

После открытия страницы в браузере:
1. Откройте консоль (F12)
2. Скопируйте ВСЕ логи начиная с "🔍 UI Renderer"
3. Отправьте логи для анализа
