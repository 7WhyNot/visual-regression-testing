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
      dashboard: {
        console: "VisionQA Console",
        overview: "Projects Overview",
        createBtn: "Create Project",
        total: "Total Projects",
        success: "Successful Tests",
        active: "Active Checks",
        noProjects: "No projects yet",
        coverage: "Test Coverage",
        created: "Created",
        modalTitle: "Create Project",
        modalDesc: "Add a new workspace for visual testing.",
        projectName: "Project Name",
        placeholder: "e.g., Marketing Website",
        cancel: "Cancel",
        creating: "Creating...",
        create: "Create"
      },
      project: {
        back: "Back to projects",
        runTests: "Run tests",
        running: "Browser is taking screenshots...",
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
        noRuns: "No test runs yet"
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
        desc: "Manage infrastructure configuration and testing parameters.",
        dbTitle: "PostgreSQL Database",
        host: "Host",
        port: "Port",
        dbName: "Database Name",
        s3Title: "S3 Storage (MinIO)",
        endpoint: "Endpoint",
        bucket: "Bucket Name",
        user: "Root User",
        pass: "Password",
        browserTitle: "Browser Engine",
        threshold: "Allowed threshold (%)",
        timeout: "Timeout (ms)",
        save: "Save settings",
        saving: "Saving...",
        success: "Settings saved successfully"
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
      dashboard: {
        console: "Консоль VisionQA",
        overview: "Обзор проектов",
        createBtn: "Создать проект",
        total: "Всего проектов",
        success: "Успешных тестов",
        active: "Активных проверок",
        noProjects: "У вас пока нет проектов",
        coverage: "Покрытие проверками",
        created: "Создан",
        modalTitle: "Создать проект",
        modalDesc: "Добавьте рабочее пространство для визуальных проверок.",
        projectName: "Название проекта",
        placeholder: "Например, Marketing Website",
        cancel: "Отмена",
        creating: "Создание...",
        create: "Создать"
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
        noRuns: "Нет запущенных тестов"
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
        desc: "Управление конфигурацией инфраструктуры и параметров тестирования.",
        dbTitle: "База данных PostgreSQL",
        host: "Хост",
        port: "Порт",
        dbName: "Имя базы данных",
        s3Title: "S3 Хранилище (MinIO)",
        endpoint: "Endpoint",
        bucket: "Bucket Name",
        user: "Root User",
        pass: "Password",
        browserTitle: "Браузерный движок",
        threshold: "Допустимая погрешность (%)",
        timeout: "Таймаут (мс)",
        save: "Сохранить настройки",
        saving: "Сохранение...",
        success: "Настройки успешно сохранены"
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
