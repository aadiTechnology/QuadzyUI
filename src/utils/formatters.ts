// filepath: react-erp-frontend/src/utils/formatters.ts

export const formatPhoneNumber = (phoneNumber: string): string => {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
};

export const formatFullName = (firstName: string, lastName: string): string => {
    return `${firstName} ${lastName}`.trim();
};

export const formatEmail = (email: string): string => {
    return email.trim().toLowerCase();
};

interface Comment {
  createdAt: string | number | Date;
  // add other properties as needed
}

const canEdit = (comment: Comment) => {
  const created = new Date(comment.createdAt).getTime();
  const now = Date.now();
  return now - created < 30 * 60 * 1000; // 30 minutes in ms
};