/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateImageTemplate = /* GraphQL */ `
  subscription OnCreateImageTemplate(
    $filter: ModelSubscriptionImageTemplateFilterInput
  ) {
    onCreateImageTemplate(filter: $filter) {
      id
      name
      rarity
      category
      description
      imageUrl
      isActive
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateImageTemplate = /* GraphQL */ `
  subscription OnUpdateImageTemplate(
    $filter: ModelSubscriptionImageTemplateFilterInput
  ) {
    onUpdateImageTemplate(filter: $filter) {
      id
      name
      rarity
      category
      description
      imageUrl
      isActive
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteImageTemplate = /* GraphQL */ `
  subscription OnDeleteImageTemplate(
    $filter: ModelSubscriptionImageTemplateFilterInput
  ) {
    onDeleteImageTemplate(filter: $filter) {
      id
      name
      rarity
      category
      description
      imageUrl
      isActive
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onCreateUser(filter: $filter, owner: $owner) {
      id
      username
      email
      totalImages
      lastClaimDate
      streakCount
      createdAt
      updatedAt
      collection {
        nextToken
        __typename
      }
      owner
      __typename
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onUpdateUser(filter: $filter, owner: $owner) {
      id
      username
      email
      totalImages
      lastClaimDate
      streakCount
      createdAt
      updatedAt
      collection {
        nextToken
        __typename
      }
      owner
      __typename
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onDeleteUser(filter: $filter, owner: $owner) {
      id
      username
      email
      totalImages
      lastClaimDate
      streakCount
      createdAt
      updatedAt
      collection {
        nextToken
        __typename
      }
      owner
      __typename
    }
  }
`;
export const onCreateCollectionItem = /* GraphQL */ `
  subscription OnCreateCollectionItem(
    $filter: ModelSubscriptionCollectionItemFilterInput
    $owner: String
  ) {
    onCreateCollectionItem(filter: $filter, owner: $owner) {
      id
      userID
      imageID
      imageName
      rarity
      category
      description
      imageUrl
      dateObtained
      createdAt
      updatedAt
      user {
        id
        username
        email
        totalImages
        lastClaimDate
        streakCount
        createdAt
        updatedAt
        owner
        __typename
      }
      owner
      __typename
    }
  }
`;
export const onUpdateCollectionItem = /* GraphQL */ `
  subscription OnUpdateCollectionItem(
    $filter: ModelSubscriptionCollectionItemFilterInput
    $owner: String
  ) {
    onUpdateCollectionItem(filter: $filter, owner: $owner) {
      id
      userID
      imageID
      imageName
      rarity
      category
      description
      imageUrl
      dateObtained
      createdAt
      updatedAt
      user {
        id
        username
        email
        totalImages
        lastClaimDate
        streakCount
        createdAt
        updatedAt
        owner
        __typename
      }
      owner
      __typename
    }
  }
`;
export const onDeleteCollectionItem = /* GraphQL */ `
  subscription OnDeleteCollectionItem(
    $filter: ModelSubscriptionCollectionItemFilterInput
    $owner: String
  ) {
    onDeleteCollectionItem(filter: $filter, owner: $owner) {
      id
      userID
      imageID
      imageName
      rarity
      category
      description
      imageUrl
      dateObtained
      createdAt
      updatedAt
      user {
        id
        username
        email
        totalImages
        lastClaimDate
        streakCount
        createdAt
        updatedAt
        owner
        __typename
      }
      owner
      __typename
    }
  }
`;
export const onCreateDailyClaim = /* GraphQL */ `
  subscription OnCreateDailyClaim(
    $filter: ModelSubscriptionDailyClaimFilterInput
    $owner: String
  ) {
    onCreateDailyClaim(filter: $filter, owner: $owner) {
      id
      userID
      claimDate
      imageID
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdateDailyClaim = /* GraphQL */ `
  subscription OnUpdateDailyClaim(
    $filter: ModelSubscriptionDailyClaimFilterInput
    $owner: String
  ) {
    onUpdateDailyClaim(filter: $filter, owner: $owner) {
      id
      userID
      claimDate
      imageID
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeleteDailyClaim = /* GraphQL */ `
  subscription OnDeleteDailyClaim(
    $filter: ModelSubscriptionDailyClaimFilterInput
    $owner: String
  ) {
    onDeleteDailyClaim(filter: $filter, owner: $owner) {
      id
      userID
      claimDate
      imageID
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
