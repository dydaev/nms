Основные опции для командной строки майнера Claymore’s Dual:

«-epool» адрес пула для добычи Эфира.

Для работы на пуле поддерживается только протокол Стратум.Майнер Claymore’s Dual поддерживает все пулы, совместимые с Dwarfpool прокси и принимает адрес кошелька Эфира непосредственно.
Для майнинга в СОЛО, укажите «http://» перед адресом. Режим http не предназначен для прокси и HTTP-пулов, в этом режиме опция «-allpools 1» будет активирована автоматически.

Примечание: майнер Claymore’s Dual v. 10 поддерживает все версии Stratum для Эфира, режим HTTP необходим только для соло — добычи.

Использование каких - либо прокси - серверов снизит эффективный хешрейт, как минимум, на 1 %, поэтому подключайте майнер напрямую к стратум - пулу.Использование пулов HTTP снизит эффективный хэшрейт, по меньшей мере, на 5 %.

«-ewal» — адрес вашего кошелька для Эфира.

Также имя воркера и другие опции, если пул их поддерживает.Пулы, требующие «Логин.Воркер» вместо адреса кошелька не поддерживаются по умолчанию, но вы можете указать «-allpools 1», чтобы там майнить.

«-epsw» — пароль для пула Эфира, укажите «x», как пароль.

«-eworker» — имя Воркера, требуется на некоторых пулах.

«-esm» — режим протокола Стратум для Эфира:

0 — режим eth - proxy(например, dwarpool.com).Это режим по умолчанию;

1 — режим qtminer(например, ethpool.org);

2 — режим miner - proxy(например, coinotron.com);

3 — режим nicehash.

«-etha» — алгоритм добычи Эфира для карт AMD:
0 — оптимизирован для быстрых карт;
1 — оптимизирован для медленных карт;
2 – для драйверов Linux gpu - pro;
-1(минус один, по умолчанию) — автоматический выбор режима, по умолчанию автоматически выбирается от 0 до 1.

Можно устанавливать эти значения индивидуально для каждой карты, например: «-etha 0, 1, 0».

«-asm» (только для плат AMD) Позволяет использовать ассемблерные ядра GPU.

В этом режиме некоторая настройка требуется даже в режиме ETH - only, используйте опцию  «-dcri» или клавиши «+ / -« во время работы программы, чтобы установить лучшую скорость.

В настоящее время в режиме ассемблера не поддерживается режим ETH - LBRY.
    Укажите «-asm 0», чтобы отключить эту опцию.Вы также можете указать значения для каждой карты, например «-asm 0, 1, 0».Значение по умолчанию — «1».
Если включен режим ASM, майнер выведет в консоль «GPU #x: algorithm ASM» при запуске.

Для получения дополнительной информации см.Раздел «Тонкая настройка» ниже.
    Новое: добавлены альтернативные ядра ассемблера для карт Tonga и Polaris для режима ETH - only.Используйте их, если вы получаете максимальную скорость в «-dcri 1» (т.е.не можете найти пик скорости), используя опцию « -asm 2» для включения этого режима.

«-ethi» — интенсивность добычи Эфира(по умолчанию «8»).

Можно уменьшить, во избежание подтормаживаний Windows или при нестабильной работе.Наименьшая нагрузка на видеокарту при «-ethi 0».Можно устанавливать значение индивидуально для каждой карты, например: «-ethi 1, 8, 6».Можно указывать и отрицательные значения, тогда это полностью соответствует параметру «global work size» в официальном майнере, например: «-ethi - 8192».

«-eres» — эта настройка связана со стабильностью майнинга Эфира.

Каждая следующая эпоха требует чуть больше видеопамяти, дуал майнер может «упасть» при переопределении буфера для нового DAG - файла.Во избежание этого, dual майнер резервирует чуть больший буфер при запуске и может работать на протяжении нескольких эпох без переопределения буфера.Эта настройка определяет, сколько эпох dual майнер будет непрерывно работать, на сколько эпох вперёд он зарезервирует буфер видеопамяти(по умолчанию 2 эпохи).

«-allpools» — укажите «-allpools 1» если майнер не хочет работать на указанном пуле(потому, что не может майнить на разработчика на этом пуле).

Активируя эту опцию в майнере Claymore’s Dual, вы соглашаетесь использовать некоторые пулы по умолчанию для майнинга на разработчика.Обратите внимание: если прекратится майнинг на разработчика, то и весь процесс майнинга будет также остановлен.

«-allcoins» — укажите «-allcoins 1» чтобы иметь возможность добывать форки Эфира.

В этом режиме Дуал майнер будет использовать некоторые пулы по умолчанию для майнинга Эфира для разработчика.Заметьте, что если прекратится майнинг на разработчика, весь процесс майнинга будет остановлен тоже.Майнеру приходится использовать два DAG - файла в этом режиме: один для Эфира и один для его форка, это может вызвать проблемы, так как файлы имеют разные размеры(ДАГ - файл Эфира больше).

Поэтому для этого режима в Дуал майнере, рекомендуется указывать текущую эпоху Эфириума(или немного большее значение), например, «-allcoins 47» означает, что дуал майнер будет резервировать размер DAG - буфера для эпохи #47 и выделит соответствующий буфер графического процессора при запуске, вместо того, чтобы перераспределить больший буфер графического процессора(может произойти сбой), когда он начинает добычу для разработчика.

Другой способ решения — это указать «-allcoins - 1» (минус один), тогда Dual майнер проведёт раунд майнинга на разработчика в самом начале и таким образом получит нужный размер буфера для текущей эпохи Эфира, после чего сможет добывать и его форк.

Если вы майните Expanse, лучший способ — это указать «-allcoins ехр», в этом режиме для разработчика будет также добываться Expanse и DAG не будет пересоздаваться.

Если вы майните ETC на каком - то пуле, который не принимает адрес кошелька, но вместо этого требует «Username.Worker», лучший способ — указать » -allcoins etc», В этом режиме майнинг на разработчика будет на пулах ETC и DAG не будет пересоздаваться заново.

«-etht» — период времени между http - запросами на новую работу в СОЛО, в миллисекундах(по умолчанию 200мс).

«-erate» — отправляет на пул хешрейт Эфира, по умолчанию «1» — отправляем хешрейт, укажите «-erate 0» если не хотите отправлять хешрейт.

«-estale» — отправляет на пул просроченные(stale) шары Эфира, это может чуть улучшить эффективный хешрейт — некоторые пулы принимают такие шары и оплачивают за них, так как они иногда принимают участие в создании uncle - блоков.По умолчанию «1» (отправляем), укажите «-estale 0» если не хотите отправлять просроченные шары.

«-dpool» — адрес пула для второй монеты(Decred, Siacoin, Lbry, Pascal).

    Используйте: «http://» для HTTP пулов,

«stratum + tcp://» для Stratum пулов. Если префикс пропущен, предполагается Stratum.

Decred: оба протокола Stratum и HTTP поддерживаются.

    Siacoin: оба протокола Stratum и HTTP поддерживаются, но не все версии Stratum поддерживаются на данный момент.

        Lbry: только Stratum поддерживается.

«-dwal» адрес кошелька для второй монеты(Decred, Siacoin, Lbry) или имя воркера — в зависимости от пула.

«-dpsw» пароль для пула второй монеты(Decred, Siacoin, Lbry, Pascal), используйте «x», если не требуется пароль.

«-di» индексы видеокарт, учавствующих в майнинге(по умолчанию задействованы все доступные видеокарты).

    Например, для фермы из четырёх видеокарт «-di 02» задействует только первую и третью(№0 и №2).
Также можно отключать видеокарты в процессе работы клавишами 0…9 клавиатуры и проверять текущую статистику клавишей «s».
Для систем с более чем 10 графическими процессорами: используйте буквы для указания индексов более 9, например, «a» означает индекс 10, «b» означает индекс 11 и т.д.

«-gser» — эта настройка может повысить стабильность на фермах с множеством видеокарт, если дуал эфириум майнер зависает при загрузке — она упорядочивает процессы инициализации.

    Применяйте «-gser 1», чтобы упорядочить часть процессов или «-gser 2», чтобы упорядочить все процессы.По - умолчанию «0» (не упорядочиваем — быстрая инициализация).

«-mode» —  выбор режима добычи: »-mode 0» (по умолчанию) — добыча Ethereum + второй монеты.«-mode 1» добыча только Эфира.

Можно задавать режим работы индивидуально для каждой карты, например: »-mode 1 - 02″ установит режим «только Эфир» для первой и третьей видеокарт(№0 и №2).
Для систем с более чем 10 графическими процессорами: используйте буквы для указания индексов более 9, например, «a» означает индекс 10, «b» означает индекс 11 и т.д.

«-dcoin» — выбор второй монеты для добычи в dual - режиме.

Возможные значения: «-dcoin dcr», «-dcoin sc», «-dcoin lbc», «-dcoin pasc».По умолчанию — «dcr».

«-dcri» — интенсивность добычи второй монеты(Decred, Siacoin, Lbry, Pascal) или значение точной настройки Ethereum в режиме ASM в режиме «только ETH», по умолчанию 30.

Можно регулировать это значение для большей скорости добычи второй монеты без снижения скорости добычи Эфира.

Можно устанавливать значение индивидуально для каждой карты, например: «-dcri 30, 100, 50».

Можно менять интенсивность в процессе работы клавишами «+», «-» и смотреть текущую статистику, нажимая клавишу «s».

Например, по умолчанию(-dcri 30) карты серии R9 390 показывают 29MH / s для Эфира и 440MH / s для Decred.Установка - dcri 70 приводит к 24MH / s для Эфира и 850MH / s для Decred.

«-dcrt» — период времени между Decred / Siacoin http - запросами новой работу, в секундах(по умолчанию 5 секунд).

«-ftime» время, после которого майнинг возвращается обратно на основной пул, в минутах(смотрите раздел FAILOVER ниже).

По умолчанию 30 минут, укажите 0 и будет считаться, что нет основного пула — не будет попыток возврата.

«-wd» — опция «сторожевой таймер».

По умолчанию «-wd 1» — включен: майнер будет закрыт(или перезапущен, см.опцию «-r») если какой - нибудь поток не отвечает в течении одной минуты или вызов OpenCL не удается.Установка «-wd 0» отключает «сторожевой таймер».

«-r» — режим перезагрузки майнера:

«-r 0» (по умолчанию) — перезапускает майнер, если что - нибудь не так с видеокартой;

«-r - 1» (минус один) — отключает автоматический перезапуск;

«-r > 20» — перезапускает майнер, если что - нибудь не так с видеокартой, или по таймеру — через указанный промежуток времени, например, «-r 60» — через каждый час;

«-r 1» — закрывает майнер и вызывает файл «reboot.bat» (для Линукс «reboot.bash» or «reboot.sh») из каталога майнера(если он там есть) если что - то не то с какой - то из видеокарт.Таким образом, вы можете создать файл «reboot.bat» и предпринять какие - то действия, например, перезагрузить компьютер, поместив там строку: «shutdown / r / t 5 / f», где: - r — перезагрузка; - t 5 — таймаут завершения работы 5 секунд; - f — принудительно завершить программы без предупреждения.

«-minspeed» — Минимальная скорость для ETH, в Mh / s.

Если Дуал клеймор майнер не может достичь этой скорости в течение 5 минут по какой - либо причине, он будет перезапущен(или будет выполнен файл «reboot.bat», если установлен » -r 1″).Значение по умолчанию — 0(функция отключена).

«-retrydelay» — задержка в секундах между попытками соединения.

Значения по умолчанию «20».Укажите «-retrydelay - 1», если вам не нужно повторное подключение, в этом режиме майнер закроется, если соединение потеряно.

«-dbg» — лог файл и сообщения отладки:

«-dbg 0» (по умолчанию) создаёт лог - файл, но не показывает служебные сообщения, «-dbg 1» — создаёт лог - файл и показывает сообщения отладки,

«-dbg - 1» (минус один) — ни файла, ни сообщений отладки.

«-logfile» — имя лог - файла.После перезапуска, майнер будет добавлять новые данные в тот же самый файл.Если хотите стереть старые данные, имя файла должно содержать строчку «noappend».Если пропущено, будет использовано имя по умолчанию.

«-nofee» — установите «1», чтобы отменить гонорар разработчика.

В этом режиме некоторые оптимизации отключаются и скорость добычи падает примерно на 4 %.При включении этого режима я теряю 100 % заработка, вы теряете лишь 2 - 3 % вашего заработка.Таким образом, у вас есть выбор: «быстрый майнер» или «совершенно бесплатный майнер, но чуть медленнее».Если вы хотите и быстро и бесплатно — вы должны найти какой - то другой майнер(не Claymore’s Dual Ethereum).Просто не используйте Дуал майнер вместо того, чтобы утверждать, что мне нужно отменить или уменьшить плату разработчику, заявив, что 1 - 2 % плата разработчика — слишком много и т.п.

«-benchmark» — режим тестирования: укажите «-benchmark 1», чтобы определить хешрейт вашего оборудования.Вы также можете указать номер эпохи для бенчмарка, например, «-benchmark 110».

«-li» — режим низкой интенсивности, уменьшает интенсивность майнинга — опция полезна при перегреве карт, однако скорость майнинга тоже снизится.

Большее значение означает меньший нагрев и скорость майнинга, например «-li 10» даёт меньший нагрев и скорость майнинга по сравнению с «-li 1».
Можно указывать значения для каждой карты, например: «-li 3, 10, 50».
Значение по умолчанию — «0», режим выключен.

«-lidag» — режим низкой интенсивности для генерации DAG.

Поддерживаемые значения 0, 1, 2, 3, больше значения означает меньшую интенсивность.Пример: «-lidag 1».Кроме того, можно указать значения для каждой карты, например «-lidag 1, 0, 3».Значение по умолчанию равно «0» (без низкой интенсивности для генерации DAG).

«-ejobtimeout» — тайм - аут работы для ETH, в минутах.Если майнер не получит новых заданий за это время, он отключится от пула.Значение по умолчанию — 10.

«-djobtimeout» — тайм - аут работы для второй монеты в дуал - режиме, в минутах.Если шахтер не получит новых заданий за это время, он отключится от пула.Значение по умолчанию — 30.

«-tt» — установка целевой температуры GPU.

    Например, «-tt 80» означает температуру 80C.Можно указать значения для каждой карты, например «-tt 70, 80, 75».Можно также установить постоянную скорость вращения вентилятора, если вы укажете отрицательные значения, например, «-tt - 50″ устанавливает скорость вращения вентилятора на 50 %.Укажите ноль, чтобы отключить управление и скрыть статистику GPU.»-tt 1″ (по умолчанию) — не управлять вентиляторами видеокарт, но показывает температуру графического процессора и скорость вентилятора каждые 30 секунд.Можно указать 2…5, если это слишком часто.

        Примечание 1: для NVIDIA карт поддерживается только мониторинг температуры, управление температурой не поддерживается.

            Примечание 2: для Linux gpu - pro драйверов, майнер должен иметь root - права для управления вентиляторами, в противном случае будет доступен только мониторинг.

«-ttdcr» — автоматически уменьшает интенсивность добычи втрой монеты, если температура графического процессора превышает указанное значение.Например, «-ttdcr 80» уменьшает интенсивность добычи второй монеты, если температура ГП выше 80 градусов.

В майнере Claymore’s Dual Вы можете видеть текущую скорость добычи второй монеты в виде подробных статистических данных(клавиша «s»).Так, если вы установите «-dcri 50», но коэффициент интенсивности второй монеты составляет 20 % это означает, что GPU в настоящее время добывает вторую монету на «-dcri 10».

Можно увидеть текущий коэффициент интенсивности в детальной статистике(клавиша «s»).Так, если задано «-dcri 50», но коэффициент интенсивности второй монеты 20 % значит реально мы сейчас добываем ее с интенсивностью «-dcri 10».Также можно указывать значения для каждой карты, например: «-ttdcr 80, 85, 80».Должно быть задано ненулевое значение для «-tt», чтобы активировать данную опцию.

Рекомендуется устанавливать значение опции «-ttdcr» как минимум на 3 - 5 градусов выше, чем опции «-tt».

«-ttli» — автоматически уменьшает интенсивность майнинга полностью(для всех монет), если температура видеокарты превышает указанное значение.Например, «-ttli 80» уменьшает интенсивность майнинга, если температура ГП выше 80 градусов.
Можно видеть, была ли уменьшена интенсивность в детальной статистике(клавиша «s»).

Также можно указать значение для каждой карты, например «-ttli 80, 85, 80».Следует задавать ненулевое значении в опции «-tt» для активации данной опции.
Хорошее решение — установить значение «-ttli» на 3 - 5 С выше, чем «-tt».

«-tstop» — Задаёт температуру графического процессора, при которой майнинг будет остановлен.Например, «-tstop 95» указывает температуру остановки 95 градусов.Кроме того, можно указать значения для каждой карты, например «-tstop 95, 85, 90».

Эта функция отключена по умолчанию(«-tstop 0»).Кроме того, следует указать ненулевое значение для опции «-tt», чтобы включить эту опцию.
Если майнер Claymore’s Dual выключил не ту карту, она закроется через 30 секунд.Можно также указать отрицательное значение, чтобы закрыть Дуал майнер немедленно вместо остановки GPU, например, «-tstop - 95» закроет клеймор майнер, как только температура любой из GPU достигнет 95 градусов.

«-fanmax» Задаёт максимальную скорость вентиляторов, в процентах, например «-fanmax 80» ограничит максимальную скорость до 80 % (по умолчанию 100 %).

Эта опция работает только если майнер управляет охлаждением, то есть когда опция «-tt» используется для указания целевой температуры.Также можно указывать значения для каждой карты, например: «-fanmax 50, 60, 70».

Примечание: для видеокарт nVidia доступен только мониторинг, управление недоступно.

«-fanmin» — Задает минимальные обороты вентилятора, в процентах, например, «-fanmin 50» установит минимальные обороты вентиляторов на 50 %.

Кроме того, можно указать значения для каждой карты, например «-fanmin 50, 60, 70».Эта опция работает только, если майнер управляет охлаждением, т.е.когда опция «-tt» используется для определения целевой температуры.Значение по умолчанию — «0».

Примечание: для NVIDIA карт эта опция не поддерживается.

«-cclock» — Задает целевую частоту ядра, в MHz.

Если не указано или «0» — дуал майнер не будет изменять текущую частоту.Можно указывать значения для каждой карты, например: «-cclock 1000, 1050, 1100, 0».К сожалению, AMD заблокировали underclocking по какой - то причине, возможен только разгон.

    Примечание: для NVIDIA карт эта опция не поддерживается.

«-mclock» — Задает целевую частоту памяти, в MHz.

Если не указано, или «0» — дуал майнер не будет изменять текущую частоту.Можно указывать значения для каждой карты, например: «-mclock 1200, 1250, 1200, 0».К сожалению, AMD заблокировали underclocking по какой - то причине, возможен только разгон.

    Примечание: для NVIDIA карт эта опция не поддерживается.

«-powlim» — Устанавливает power limit, в диапазоне от - 50 до 50. Если не указано — майнер не будет изменять power limit.Можно указывать значения для каждой карты, например: «-powlim 20, -20, 0, 10».

Примечание: для NVIDIA карт эта опция не поддерживается.

«-cvddc» — Устанавливает целевое напряжение ядра GPU, умноженное на 1000. Например, «-cvddc 1050» означает 1.05V.Также можно указать значение для каждой карты, например: «-cvddc 900, 950, 1000, 970».
Поддерживается новейшими картами AMD 4xx только под Windows.

    Примечание: для видеокарт NVIDIA данная опция не поддеживается.

«-mvddc» — Устанавливает целевое напряжение памяти, умноженное на 1000. Например, «-cvddc 1050» означает 1.05V.Также можно указать значение для каждой карты, например: «-cvddc 900, 950, 1000, 970».
Поддерживается новейшими картами AMD 4xx только под Windows.

    Примечание: для видеокарт NVIDIA данная опция не поддерживается.

«-mport» — Порт для удалённого управления / мониторинга.Значение по умолчанию - 3333(только чтение),
    Укажите «-mport 0», чтобы отключить функцию удаленного мониторинга.Укажите отрицательное значение для включения мониторинга(получения статистики), но отключения управления(перезагрузки, загрузки файлов), например, «-mport - 3333» включает порт 3333 для удаленного мониторинга, но удаленное управление при этом будет заблокировано.
Вы также можете использовать свой веб - браузер для просмотра текущего состояния шахтера на дуале, например, введите «localhost: 3333» в браузере.

    Предупреждение: используйте отрицательное значение параметра или полностью отключите удаленное управление, если считаете, что вас могут атаковать через этот порт!

По умолчанию, майнер будет принимать подключения по указанному порту на всех сетевых адаптерах, но вы можете напрямую выбрать нужный сетевой интерфейс, например, «-mport 127.0.0.1: 3333» откроет порт только на локальном хосте.
- mpsw пароль удаленного мониторинга(управления).По умолчанию он пуст, поэтому каждый может запросить статистику или управлять шахтером удаленно, если установлена опция - mport.Вы можете установить пароль для удаленного доступа(по крайней мере EthMan v3.0 требуется для поддержки паролей).

«-colors» — Включает или выключает цветной текст в консоли майнера клеймор дуал.По умолчанию «1», используйте «-colors 0» чтобы отключить раскраску.Используйте значения 2, 3, 4 для удаления некоторых цветов.

«-v» — выводит версию майнера.Пример использования: «-v 1».

«-altnum» — Альтернативная нумерация GPU.Этот параметр не меняет порядок GPU, а изменяет номера GPU, которые отображаются в майнере, в некоторых случаях он может быть полезен.

Возможные значения:
0: индексирование GPU по умолчанию.Например, если вы укажете «-di 05», выбрав первый и последний графические процессоры из шести, майнер отобразит эти две выбранные карты в виде «GPU0» и «GPU1».
1: то же, что и «0», но индексы начинаются с единицы, а не с нуля.Например, если вы укажете «-di 05» для выбора первого и последнего из шести установленных графических процессоров, майнер отобразит эти две карты как «GPU1» и «GPU2».
2: альтернативная индексация GPU.Например, если вы укажете «-di 05» для выбора первого и последнего из шести установленных графических процессоров, майнер отобразит эти две карты как «GPU0» и «GPU5».
3: то же, что и «2», но индексы начинаются с единицы, а не с нуля.Например, если вы укажете «-di 05» для выбора первого и последнего из шести установленных графических процессоров, майнер отобразит эти две выбранные карты как «GPU1» и «GPU6».
Значение по умолчанию — «0».

«-platform» — выбирает производителя графических процессоров.

1 — использует только графические процессоры AMD.

2 — использует только графические процессоры NVIDIA.

3 — использует графические процессоры AMD и NVIDIA.

Значение по умолчанию — «3»