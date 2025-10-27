import { format } from 'date-fns';

// Obtener fecha actual en Colombia (hora local del navegador)
export const getCurrentDateColombia = (): Date => {
  return new Date();
};

// Formatear fecha para mostrar (desde string YYYY-MM-DD)
export const formatDateColombia = (dateStr: string, formatStr: string = 'yyyy-MM-dd'): string => {
  // Validar que dateStr existe y tiene el formato correcto
  if (!dateStr || typeof dateStr !== 'string') {
    console.error('formatDateColombia: fecha inválida', dateStr);
    return 'Fecha inválida';
  }

  // Validar formato YYYY-MM-DD
  const parts = dateStr.split('-');
  if (parts.length !== 3) {
    console.error('formatDateColombia: formato incorrecto', dateStr);
    return dateStr; // Devolver el string original si no tiene el formato esperado
  }

  const [year, month, day] = parts.map(Number);
  
  // Validar que los valores son números válidos
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    console.error('formatDateColombia: valores no numéricos', { year, month, day });
    return dateStr;
  }

  // Crear fecha y validar que es válida
  const date = new Date(year, month - 1, day);
  
  if (isNaN(date.getTime())) {
    console.error('formatDateColombia: fecha inválida después de crear Date', dateStr);
    return dateStr;
  }

  try {
    return format(date, formatStr);
  } catch (error) {
    console.error('formatDateColombia: error al formatear', error);
    return dateStr;
  }
};

// Obtener string de fecha en formato YYYY-MM-DD
export const getColombiaDateString = (date?: Date): string => {
  const dateToUse = date || new Date();
  const year = dateToUse.getFullYear();
  const month = String(dateToUse.getMonth() + 1).padStart(2, '0');
  const day = String(dateToUse.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Crear fecha con hora específica en hora local
export const createDateWithTime = (dateString: string, hours: number, minutes: number = 0): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0);
};

// Check-in: 2:00 PM
export const getCheckInDateTime = (dateString: string): Date => {
  return createDateWithTime(dateString, 14, 0);
};

// Check-out: 12:00 PM
export const getCheckOutDateTime = (dateString: string): Date => {
  return createDateWithTime(dateString, 12, 0);
};
