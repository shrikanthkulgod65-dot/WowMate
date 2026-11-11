
export const subscriptionPlans = {
  starter: {
    id: "starter",
    name: "Starter",
    price: 9,
    durationDays: 7,
    interestLimit: 3,
    features: {
      createProfile: true,
      browsePublicProfiles: true,
      basicMatchmaking: true,
      limitedProfileDetails: true,
      exploreBrokers: true,
      contactDetails: false,
      advancedFilters: false,
      favourites: false,
      priorityVisibility: false,
      prioritySupport: false,
      protectedBrokerDetails: false,
    },
  },

  silver: {
    id: "silver",
    name: "Silver",
    price: 299,
    durationDays: 30,
    interestLimit: 25,
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
    },
  },

  gold: {
    id: "gold",
    name: "Gold",
    price: 699,
    durationDays: 90,
    interestLimit: -1,
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
    },
  },
};

export const getPlan = (planId) => {
  return subscriptionPlans[planId] || null;
};

export const getPublicPlans = () => {
  return Object.values(subscriptionPlans);
};
