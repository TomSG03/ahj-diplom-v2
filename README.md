# Продвинутый JavaScript в браузере
### [Итоговая работа - Chaos Organizer](https://github.com/TomSG03/ahj-diploma)
### [Gh-Pages](https://tomsg03.github.io/ahj-diplom-v2/)
### [Back-End](https://github.com/TomSG03/ahj-diplom-be)
### [Heroky](https://git.heroku.com/ahj-diplom-be.git)

## Обязательные функции

###    1.  Сохранение в истории ссылок и текстовых сообщений
###    2.  Ссылки (то, что начинается с http:// или https://)

  ![Ссылки](https://github.com/TomSG03/ahj-diplom-v2/blob/main/imageMD/Links.png)

###    3.  Сохранение в истории изображений, видео и аудио (как файлов) - через Drag & Drop и через иконку загрузки (скрепка)
- Drag & Drop - работает в любой момент времени. Ничего дополнительно нажимать не нужно. Можно 'бросать' больше чем один файл.

  ![DnD загрузка файлов](https://github.com/TomSG03/ahj-diplom-v2/blob/main/imageMD/DnD.png)
  
- Иконка 'Cкрепка' служит для вызова меню и выбора типа загружаемого файла. Пункт меню 'Файл' позволяет выбрать любой файл. Можно выделять несколько файлов. 

  ![Загрузка файлов через меню](https://github.com/TomSG03/ahj-diplom-v2/blob/main/imageMD/UploadFiles.png)

###    5. Скачивание файлов.

   Для сохранения файлов (на компьютер пользователя) необходимо вызвать всплывающее меню на соответствующем сообщении и выбрать пункт 'Сохранить'

   ![Скачивание файлов](https://github.com/TomSG03/ahj-diplom-v2/blob/main/imageMD/Save.png)

###    6. Ленивая подгрузка.

  Сначала подгружаются последние 10 сообщений, при прокрутке вверх подгружаются следующие 10 и т.д.

## Дополнительные для реализации функции

### 1. Синхронизация

  Cинхронизация нескольких открытых вкладок, как между отдельными вкладками в рамках одного браузера, так и между отдельными браузерами и устройствами.

### 2. Поиск по сообщениям

  Для начала поиска нужно кликнуть на лупу. Откроется вкладка со строкой ввода текста. Если сообщение текстовое, то анализируется текст. Если файл, то проверяется имя файла.

  ![Поиск по сообщениям](https://github.com/TomSG03/ahj-diplom-v2/blob/main/imageMD/Searh.png)

### 3. Запись видео и аудио (используя API браузера)

  * Запись аудио-сообщений начинается с клика на 'микрофон'

   ![Микрофон](https://github.com/TomSG03/ahj-diplom-v2/blob/main/imageMD/microfon.png)

    После этого откроется панель управления записью и автоматически начнется запись.

   ![Панель управления записью](https://github.com/TomSG03/ahj-diplom-v2/blob/main/imageMD/recPanel.png)

    Чтобы отправить сообщение необходимо остановить запись и нажать 'Отправить'.
    Так же можно отменить\прослушать\повторить запись нажимая соответствующие кнопки.

  * Запись видео-сообщений начинается с клика на 'камеру'

   ![Камера](https://github.com/TomSG03/ahj-diplom-v2/blob/main/imageMD/Cam.png)
  
    После этого откроется панель управления и поле показывающее изображение с камеры.
    Запись начнется автоматически.

   ![Камера](https://github.com/TomSG03/ahj-diplom-v2/blob/main/imageMD/CamRec.png)

   ![Панель управления записью](https://github.com/TomSG03/ahj-diplom-v2/blob/main/imageMD/recPanel.png)

    Чтобы отправить сообщение необходимо остановить запись и нажать 'Отправить'.
    Так же можно отменить\посмотреть\повторить запись нажимая соответствующие кнопки.

### 4. Отправка геолокации

  Отправка гео-данных определяется пунктом меню 'Геолокация'. Если галочка установлена гео-данные будут отправлятся. 
  
  ![Гео-данные](https://github.com/TomSG03/ahj-diplom-v2/blob/main/imageMD/Geo.png)

  Если отправка в брузере запрещена, то пользователю будет предложено ввести координаты вручную.

  ![Запрос гео-данных](https://github.com/TomSG03/ahj-diplom-v2/blob/main/imageMD/GeoRec.png)

  Информация о геолокации добавлятся в нижнюю часть сообщенияю.

  ![Запрос гео-данных](https://github.com/TomSG03/ahj-diplom-v2/blob/main/imageMD/geoMess.png)

### 5. Отправка команд боту

  Chaos Organizer поддерживает команду @chaos: 'команда'. Где 'команда' может принимать следующие значения:

  1.  ? - Список команд 
  2.  Погода - Погода (Рандомные сообщения - выборка из массива)
  3.  Привет - Пример приветствия (Рандомные сообщения - выборка из массива)
  4.  Избранное - Показать избранное (С сервера пересылается имя функции которая исполнится на клиенте. При этом функция исполнится во всех открытых вкладках)
  5.  Данные - Информация о хранилище (Пересылается информация о состоянии "базы данных")

  ![Команды](https://github.com/TomSG03/ahj-diplom-v2/blob/main/imageMD/bot.png)

### 6. Добавление сообщения в избранное

  Чтобы добавить сообщение в избранное нужно во всплывающем меню выбрать 'В избранное'. При этом перед датой сообщения появится звездочка.
  
  ![В избранное](https://github.com/TomSG03/ahj-diplom-v2/blob/main/imageMD/addFavorites.png)
  
  Чтобы удалить сообщение из избранного нужно во всплывающем меню выбрать 'Удалить из избранного'. Звездочка перед датой сообщения удалится.

  ![Удалить из избранного](https://github.com/TomSG03/ahj-diplom-v2/blob/main/imageMD/delFavorites.png)

  Чтобы посмотреть все избранные сообщения нужно кликнуть на символ '⋮' и выбрать пункт 'Избранное'

  ![Избранное](https://github.com/TomSG03/ahj-diplom-v2/blob/main/imageMD/Favorites.png)

### 7. Просмотр вложений по категориям

  Категории можно посмотреть по следующем пути: Клик на символ '⋮' -> пункт 'Категории' -> Выбрать нужную категорию

  ![Категории](https://github.com/TomSG03/ahj-diplom-v2/blob/main/imageMD/Groups.png)

---

Дополнительно есть возможность удалить сообщения как по одному, 

  ![Удаление сообщения](https://github.com/TomSG03/ahj-diplom-v2/blob/main/imageMD/delItem.png)

так и все сразу

  ![Удаление всех сообщения](https://github.com/TomSG03/ahj-diplom-v2/blob/main/imageMD/delAll.png)

При потере связи с сервером показывается сообщение

  ![Ошибка соединения](https://github.com/TomSG03/ahj-diplom-v2/blob/main/imageMD/wsError.png)
  
Все пункты меню(клика) выполнены с испльзованием button, поэтому Chaos Organizer хорошо работает на устройствах с 
сенсорным экраном
