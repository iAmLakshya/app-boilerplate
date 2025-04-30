// Convert Full name into initials
export const generateUserInitials = (
  fullName: string | undefined | null,
  initialType: 'FML' | 'FL' | 'F' = 'FL'
): string => {
  if (!fullName) return '';
  const words = fullName.split(' ');
  if (initialType === 'F') {
    // Only first name
    return words[0].charAt(0).toUpperCase();
  } else if (initialType === 'FL' && words.length > 2) {
    // First and last name
    return (
      words[0].charAt(0).toUpperCase() +
      words[words.length - 1].charAt(0).toUpperCase()
    );
  }
  const initials = words.map((word) => word.charAt(0).toUpperCase());
  return initials.join('');
};
