import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      nav: {
        projects: "Projects",
        reports: "Reports",
        settings: "Settings"
      },
      header: {
        profile: "My Profile",
        workspace: "Workspace Settings",
        switchLang: "Switch Language",
        theme: "Theme",
        themes: { light: "Light", dark: "Dark", hacker: "Hacker" },
        logout: "Log Out",
        notifications: "Notifications",
        markAllRead: "Mark all as read",
        noNotifications: "No new notifications"
      },
      dashboard: {
        console: "VisionQA Console",
        overview: "Projects Overview",
        overviewDesc: "Overview of your visual regression tests across all projects.",
        createBtn: "Create Project",
        total: "Total Projects",
        success: "Success Rate",
        active: "Bugs Found",
        savedHours: "Hours Saved",
        recentActivity: "Recent Activity",
        noActivity: "No recent activity",
        noProjects: "No projects yet",
        created: "Created",
        modalTitle: "Create Project",
        modalDesc: "Add a new workspace for visual testing.",
        projectName: "Project Name",
        placeholder: "e.g., Marketing Website",
        cancel: "Cancel",
        creating: "Creating...",
        create: "Create",
        testsCompleted: "Tests completed!"
      },
      project: {
        back: "Back to projects",
        runTests: "Trigger Manual Run",
        running: "Running tests...",
        addScenario: "Add Scenario",
        scenarioName: "Component / Page Name",
        scenarioNamePh: "e.g., Home Page",
        url: "URL to check",
        urlError: "Enter a valid URL (with http:// or https://)",
        preset: "Device Preset",
        addBtn: "Add to project",
        scenarios: "Scenarios",
        noScenarios: "No scenarios yet",
        runHistory: "Run History",
        runId: "Run ID",
        status: "Status",
        date: "Start Date",
        noRuns: "No test runs yet",
        ignoredSelectors: "Ignored Selectors (comma separated)",
        ignoredDesc: "Elements matching these CSS selectors will be hidden before taking the screenshot.",
        sensitivity: "Sensitivity (Threshold)",
        sensitivityDesc: "Lower value means higher sensitivity to visual changes."
      },
      report: {
        back: "Back to project",
        reportOf: "Run Report",
        sec: "sec",
        success: "Success",
        changes: "Changes Detected",
        progress: "Execution Progress",
        total: "Total",
        passed: "Passed",
        failed: "Failed",
        allTests: "All Tests",
        onlyFailed: "Only Failed",
        onlyPassed: "Only Passed",
        mismatch: "mismatch",
        acceptStd: "Approve as standard",
        markBug: "Mark as bug",
        foundErrors: "Errors found:",
        approveAll: "Approve all",
        rejectAll: "Reject all"
      },
      diff: {
        modes: {
          baseline: "Baseline",
          current: "Current",
          swipe: "Swipe",
          overlay: "Overlay",
          sideBySide: "Side by Side"
        },
        colors: {
          red: "Red",
          pink: "Neon Pink",
          yellow: "Yellow"
        },
        hotkeys: "Hotkeys:",
        zoom: "Zoom",
        tabs: "Tabs",
        approve: "Approve",
        reject: "Reject",
        emptyBaseline: "Baseline is missing",
        emptyCurrent: "Current version is missing"
      },
      settings: {
        title: "System Settings",
        desc: "Manage your account, workspace, and infrastructure configurations.",
        tabs: {
          general: "General",
          notifications: "Notifications",
          api: "API & CI/CD",
          team: "Team",
          danger: "Danger Zone"
        },
        general: {
          workspaceName: "Workspace Name",
          timezone: "Timezone",
          defaultLanguage: "Default Language"
        },
        notifs: {
          email: "Email Notifications",
          emailDesc: "Receive daily digests and failure alerts.",
          slack: "Slack Integration",
          slackDesc: "Post test results directly to your team channel.",
          browser: "Browser Push",
          browserDesc: "Get instant alerts when manual runs complete."
        },
        apiConfig: {
          key: "API Key",
          keyDesc: "Use this key to authenticate with our CI/CD runner.",
          copy: "Copy Key",
          copied: "Copied to clipboard!"
        },
        teamModule: {
          name: "Name",
          role: "Role",
          admin: "Admin",
          viewer: "Viewer",
          qa: "QA Engineer"
        },
        dangerZone: {
          deleteProject: "Delete Workspace",
          deleteDesc: "Permanently remove your workspace and all visual test data.",
          deleteBtn: "Delete Workspace"
        },
        save: "Save changes",
        saving: "Saving...",
        success: "Settings saved successfully"
      },
      feedback: {
        title: "Send Feedback",
        type: "Feedback Type",
        types: { bug: "Bug Report", feature: "Feature Request", question: "Question" },
        message: "Message",
        messagePh: "Tell us what's on your mind...",
        attach: "Attach Screenshot",
        submit: "Submit Feedback",
        success: "Thanks! Your feedback has been sent."
      }
    }
  },
  ru: {
    translation: {
      nav: {
        projects: "Проекты",
        reports: "Отчеты",
        settings: "Настройки"
      },
      header: {
        profile: "Мой профиль",
        workspace: "Настройки Workspace",
        switchLang: "Сменить язык",
        theme: "Тема",
        themes: { light: "Светлая", dark: "Темная", hacker: "Хакер" },
        logout: "Выйти",
        notifications: "Уведомления",
        markAllRead: "Прочитать всё",
        noNotifications: "Нет новых уведомлений"
      },
      dashboard: {
        console: "Консоль VisionQA",
        overview: "Обзор проектов",
        overviewDesc: "Статистика и обзор ваших визуальных тестов по всем проектам.",
        createBtn: "Создать проект",
        total: "Всего проектов",
        success: "Успешность (Pass Rate)",
        active: "Найдено багов",
        savedHours: "Сэкономлено часов",
        recentActivity: "Последняя активность",
        noActivity: "Нет активности",
        noProjects: "У вас пока нет проектов",
        created: "Создан",
        modalTitle: "Создать проект",
        modalDesc: "Добавьте рабочее пространство для визуальных проверок.",
        projectName: "Название проекта",
        placeholder: "Например, Marketing Website",
        cancel: "Отмена",
        creating: "Создание...",
        create: "Создать",
        testsCompleted: "Тесты завершены!"
      },
      project: {
        back: "Назад к списку проектов",
        runTests: "Запустить тесты",
        running: "Браузер делает снимки...",
        addScenario: "Добавить сценарий",
        scenarioName: "Название компонента / страницы",
        scenarioNamePh: "Например: Главная страница",
        url: "URL для проверки",
        urlError: "Введите корректный URL (с http:// или https://)",
        preset: "Пресет устройства",
        addBtn: "Добавить в проект",
        scenarios: "Сценарии",
        noScenarios: "Сценариев пока нет",
        runHistory: "История прогонов",
        runId: "ID Прогона",
        status: "Статус",
        date: "Дата запуска",
        noRuns: "Нет запущенных тестов",
        ignoredSelectors: "Игнорируемые селекторы (через запятую)",
        ignoredDesc: "Элементы по этим селекторам будут скрыты перед снимком.",
        sensitivity: "Чувствительность (Threshold)",
        sensitivityDesc: "Меньшее значение означает более высокую чувствительность к изменениям."
      },
      report: {
        back: "Назад к проекту",
        reportOf: "Отчет прогона",
        sec: "сек",
        success: "Успешно",
        changes: "Обнаружены изменения",
        progress: "Прогресс выполнения",
        total: "Всего",
        passed: "Успешно",
        failed: "Ошибки",
        allTests: "Все тесты",
        onlyFailed: "Только ошибки",
        onlyPassed: "Успешные",
        mismatch: "расхождение",
        acceptStd: "Утвердить эталон",
        markBug: "Пометить как баг",
        foundErrors: "Найдено ошибок:",
        approveAll: "Одобрить все",
        rejectAll: "Отклонить все"
      },
      diff: {
        modes: {
          baseline: "Эталон",
          current: "Текущая",
          swipe: "Шторка",
          overlay: "Наложение",
          sideBySide: "Рядом"
        },
        colors: {
          red: "Красный",
          pink: "Неоновый розовый",
          yellow: "Желтый"
        },
        hotkeys: "Горячие клавиши:",
        zoom: "Зум",
        tabs: "Вкладки",
        approve: "Одобрить",
        reject: "Отклонить",
        emptyBaseline: "Эталон недоступен",
        emptyCurrent: "Текущая версия недоступна"
      },
      settings: {
        title: "Настройки системы",
        desc: "Управление аккаунтом, инфраструктурой и интеграциями.",
        tabs: {
          general: "Общие",
          notifications: "Уведомления",
          api: "API и CI/CD",
          team: "Команда",
          danger: "Опасная зона"
        },
        general: {
          workspaceName: "Имя Workspace",
          timezone: "Часовой пояс",
          defaultLanguage: "Язык по умолчанию"
        },
        notifs: {
          email: "Email уведомления",
          emailDesc: "Получать ежедневные отчеты и алерты об ошибках.",
          slack: "Интеграция со Slack",
          slackDesc: "Отправлять результаты прямо в канал вашей команды.",
          browser: "Push в браузере",
          browserDesc: "Мгновенные уведомления о завершении тестов."
        },
        apiConfig: {
          key: "API Ключ",
          keyDesc: "Используйте этот ключ для CI/CD раннеров (GitHub Actions, GitLab CI).",
          copy: "Скопировать ключ",
          copied: "Скопировано в буфер!"
        },
        teamModule: {
          name: "Имя",
          role: "Роль",
          admin: "Админ",
          viewer: "Наблюдатель",
          qa: "QA Инженер"
        },
        dangerZone: {
          deleteProject: "Удалить Workspace",
          deleteDesc: "Безвозвратно удаляет воркспейс и все тестовые данные из БД и S3.",
          deleteBtn: "Удалить Workspace"
        },
        save: "Сохранить изменения",
        saving: "Сохранение...",
        success: "Настройки успешно сохранены"
      },
      feedback: {
        title: "Оставить отзыв",
        type: "Тип сообщения",
        types: { bug: "Сообщить о баге", feature: "Запросить фичу", question: "Вопрос" },
        message: "Сообщение",
        messagePh: "Расскажите нам о проблеме или идее...",
        attach: "Прикрепить скриншот",
        submit: "Отправить",
        success: "Спасибо! Ваш отзыв успешно отправлен."
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
