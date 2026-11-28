
export const subscriptionPlans = {
  starter: {
    id: "starter",
    name: "Starter",
    price: 9,
    durationDays: 7,
    interestLimit: 3,
    contactUnlockLimit: 3,
    priorityInterestLimit: 0,
    profileBoostLimit: 0,
    features: {
      createProfile: true,
      browsePublicProfiles: true,
      basicMatchmaking: true,
      limitedProfileDetails: true,
      exploreBrokers: true,
      contactDetails: true,
      advancedFilters: false,
      favourites: false,
      priorityVisibility: false,
      prioritySupport: false,
      protectedBrokerDetails: false,
      profileBoosts: false,
    },
  },

  silver: {
    id: "silver",
    name: "Silver",
    price: 299,
    durationDays: 30,
    interestLimit: 30,
    contactUnlockLimit: 10,
    priorityInterestLimit: 2,
    profileBoostLimit: 0,
    features: {
      createProfile: true,
      browsePublicProfiles: true,
      basicMatchmaking: true,
      limitedProfileDetails: false,
      exploreBrokers: true,
      contactDetails: true,
      advancedFilters: true,
      favourites: true,
      priorityVisibility: false,
      prioritySupport: false,
      protectedBrokerDetails: true,
      profileBoosts: false,
    },
  },

  gold: {
    id: "gold",
    name: "Gold",
    price: 699,
    durationDays: 30,
    interestLimit: 100,
    contactUnlockLimit: 30,
    priorityInterestLimit: 10,
    profileBoostLimit: 5,
    features: {
      createProfile: true,
      browsePublicProfiles: true,
      basicMatchmaking: true,
      limitedProfileDetails: false,
      exploreBrokers: true,
      contactDetails: true,
      advancedFilters: true,
      favourites: true,
      priorityVisibility: true,
      prioritySupport: true,
      protectedBrokerDetails: true,
      profileBoosts: true,
    },
  },
};

export const getPlan = (planId) =>
  subscriptionPlans[planId] || null;

export const getPublicPlans = () =>
  Object.values(subscriptionPlans);
