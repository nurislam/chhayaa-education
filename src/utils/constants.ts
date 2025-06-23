export const LIMIT = 10;
export const TOKEN = "token";
export const PERMISSIONS = "permissions";
export const AUTH_CRED = "AUTH_CRED";
export const PRE_AUTH_CRED = "PRE_AUTH_CRED";

export const ROLES = {
  SUPER_ADMIN: "developer",
  ADMIN: "admin",
  VENDOR: "vendor",
  ACCOUNT: "account",
  GUEST: "guest",
};

export const PermissionsMsg = `You can't edit this client, the client owner or an admin must add you to the assistant list or transfer ownership.`;

export const GetAverageReview = (data: any) => {
  const one = data.toOneStar;
  const two = data.toTwoStar;
  const three = data.toThreeStar;
  const four = data.toFourStar;
  const five = data.toFiveStar;
  return ((one + two * 2 + three * 3 + four * 4 + five * 5) / (one + two + three + four + five)).toFixed(2);
};

export const GetDeafultAverageReview = (data: any) => {
  const one = data.oneStar;
  const two = data.twoStar;
  const three = data.threeStar;
  const four = data.fourStar;
  const five = data.fiveStar;
  return ((one + two * 2 + three * 3 + four * 4 + five * 5) / (one + two + three + four + five)).toFixed(2);
};


export const GetTotalReview = (data: any) => {
  return data.toOneStar + data.toTwoStar + data.toThreeStar + data.toFourStar + data.toFiveStar;
};

export const GetDefaultTotalReview = (data: any) => {
  return data.oneStar + data.twoStar + data.threeStar + data.fourStar + data.fiveStar;
};


export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str;

  const words = str.split(' ');

  if (words.length > 1) {
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
    words[1] = words[1].charAt(0).toUpperCase() + words[1].slice(1).toLowerCase();
  } else {
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
  }

  return words.join(' ');
};

