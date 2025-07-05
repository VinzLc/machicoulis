/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getImageTemplate = /* GraphQL */ `
  query GetImageTemplate($id: ID!) {
    getImageTemplate(id: $id) {
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
export const listImageTemplates = /* GraphQL */ `
  query ListImageTemplates(
    $filter: ModelImageTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listImageTemplates(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getCollectionItem = /* GraphQL */ `
  query GetCollectionItem($id: ID!) {
    getCollectionItem(id: $id) {
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
export const listCollectionItems = /* GraphQL */ `
  query ListCollectionItems(
    $filter: ModelCollectionItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCollectionItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const collectionItemsByUserID = /* GraphQL */ `
  query CollectionItemsByUserID(
    $userID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelCollectionItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    collectionItemsByUserID(
      userID: $userID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getDailyClaim = /* GraphQL */ `
  query GetDailyClaim($id: ID!) {
    getDailyClaim(id: $id) {
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
export const listDailyClaims = /* GraphQL */ `
  query ListDailyClaims(
    $filter: ModelDailyClaimFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDailyClaims(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userID
        claimDate
        imageID
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const dailyClaimsByUserID = /* GraphQL */ `
  query DailyClaimsByUserID(
    $userID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelDailyClaimFilterInput
    $limit: Int
    $nextToken: String
  ) {
    dailyClaimsByUserID(
      userID: $userID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userID
        claimDate
        imageID
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
