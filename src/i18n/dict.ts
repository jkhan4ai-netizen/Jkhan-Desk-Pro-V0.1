import { cookies } from "next/headers";

export type Lang = 'uz' | 'ru';

export const DICT = {
  uz: {
    sidebar: {
      dashboard: "Bosh sahifa",
      projects: "Loyihalar",
      crm: "CRM (Mijozlar)",
      finance: "Moliya",
      focus: "Fokus (Vazifalar)",
      wishlist: "Xaridlar",
      system: "Tizim",
      settings: "Sozlamalar",
      help: "Yordam",
      menu: "Menyu",
      logout: "Chiqish",
      endSession: "Seansni yakunlash"
    },
    dashboard: {
      welcome: "Xush kelibsiz",
      subtitle: "Bugun loyihalaringizda nimalar sodir bo'lyapti.",
      startTimer: "Taymerni boshlash",
      pendingTasks: "Joriy Vazifalar",
      pendingTasksDesc: "Bajarilishi kerak yoki jarayondagi vazifalar.",
      focusTime: "Fokus vaqti",
      focusDesc: "Taymerni bu yerdan boshqaring.",
      allTasksDone: "Barcha vazifalar bajarildi!"
    },
    focus: {
      title: "Taym-Menejment va Vazifalar",
      subtitle: "Diqqatni jamlash uchun Pomodoro va Vazifalarni birgalikda ishlating.",
      pomodorosToday: "Bugungi pomodorolar",
      inDeepFocus: "Chuqur fokusda",
      history: "Bugungi tarix",
      completedSessions: "Yakunlangan seanslar",
      noSessions: "Bugun taymerni hali ishga tushirmadingiz.",
      focus: "Fokus",
      break: "Dam olish",
      tasks: "Vazifalar",
      tasksDesc: "Bugun nimalar qilamiz?",
      newTask: "Yangi vazifa"
    },
    crm: {
      title: "Mijozlar (CRM)",
      subtitle: "Mijozlar bazasi va aloqa ma'lumotlarini boshqaring.",
      newClient: "Yangi Mijoz",
      database: "Mijozlar Bazasi",
      dbDesc: "Siz ishlagan barcha mijozlar.",
      name: "Ism",
      company: "Kompaniya",
      contacts: "Kontaktlar",
      status: "Holati",
      noClients: "Mijozlar yo'q",
      noClientsDesc: "Sizning bazangizda hozircha mijozlar yo'q."
    },
    common: {
      save: "Saqlash",
      cancel: "Bekor qilish",
      add: "Qo'shish",
      edit: "Tahrirlash",
      delete: "O'chirish"
    }
  },
  ru: {
    sidebar: {
      dashboard: "Дашборд",
      projects: "Проекты",
      crm: "CRM (Клиенты)",
      finance: "Финансы",
      focus: "Фокус (Задачи)",
      wishlist: "Покупки",
      system: "Система",
      settings: "Настройки",
      help: "Помощь",
      menu: "Меню",
      logout: "Выйти",
      endSession: "Завершить сеанс"
    },
    dashboard: {
      welcome: "Добро пожаловать",
      subtitle: "Вот что происходит с вашими проектами сегодня.",
      startTimer: "Запустить Таймер",
      pendingTasks: "Текущие Задачи",
      pendingTasksDesc: "Ваши задачи в статусе 'Нужно сделать' или 'В работе'.",
      focusTime: "Время фокусировки",
      focusDesc: "Управляйте таймером отсюда.",
      allTasksDone: "Все текущие задачи выполнены!"
    },
    focus: {
      title: "Тайм-Менеджмент и Задачи",
      subtitle: "Используйте метод Pomodoro и Задачи вместе для глубокого фокуса.",
      pomodorosToday: "Помидорок сегодня",
      inDeepFocus: "В глубоком фокусе",
      history: "История за сегодня",
      completedSessions: "Завершенные сессии",
      noSessions: "Вы еще не запускали таймер сегодня.",
      focus: "Фокус",
      break: "Отдых",
      tasks: "Задачи",
      tasksDesc: "Что нужно сделать?",
      newTask: "Новая задача"
    },
    crm: {
      title: "Клиенты (CRM)",
      subtitle: "Управляйте базой заказчиков и контактными данными.",
      newClient: "Новый Клиент",
      database: "База Клиентов",
      dbDesc: "Все клиенты, с которыми вы когда-либо работали.",
      name: "Имя",
      company: "Компания",
      contacts: "Контакты",
      status: "Статус",
      noClients: "Нет клиентов",
      noClientsDesc: "В вашей базе пока нет клиентов."
    },
    common: {
      save: "Сохранить",
      cancel: "Отмена",
      add: "Добавить",
      edit: "Редактировать",
      delete: "Удалить"
    }
  }
};

export async function getLang(): Promise<Lang> {
  const cookieStore = await cookies();
  const lang = cookieStore.get('NEXT_LOCALE')?.value;
  return (lang === 'ru' ? 'ru' : 'uz') as Lang;
}

export function getDictionary(lang: Lang) {
  return DICT[lang] || DICT.uz;
}
