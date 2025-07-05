/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createImageTemplate = /* GraphQL */ `
  mutation CreateImageTemplate(
    $input: CreateImageTemplateInput!
    $condition: ModelImageTemplateConditionInput
  ) {
    createImageTemplate(input: $input, condition: $condition) {
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
export const updateImageTemplate = /* GraphQL */ `
  mutation UpdateImageTemplate(
    $input: UpdateImageTemplateInput!
    $condition: ModelImageTemplateConditionInput
  ) {
    updateImageTemplate(input: $input, condition: $condition) {
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
export const deleteImageTemplate = /* GraphQL */ `
  mutation DeleteImageTemplate(
    $input: DeleteImageTemplateInput!
    $condition: ModelImageTemplateConditionInput
  ) {
    deleteImageTemplate(input: $input, condition: $condition) {
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
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createCollectionItem = /* GraphQL */ `
  mutation CreateCollectionItem(
    $input: CreateCollectionItemInput!
    $condition: ModelCollectionItemConditionInput
  ) {
    createCollectionItem(input: $input, condition: $condition) {
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
export const updateCollectionItem = /* GraphQL */ `
  mutation UpdateCollectionItem(
    $input: UpdateCollectionItemInput!
    $condition: ModelCollectionItemConditionInput
  ) {
    updateCollectionItem(input: $input, condition: $condition) {
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
export const deleteCollectionItem = /* GraphQL */ `
  mutation DeleteCollectionItem(
    $input: DeleteCollectionItemInput!
    $condition: ModelCollectionItemConditionInput
  ) {
    deleteCollectionItem(input: $input, condition: $condition) {
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
export const createDailyClaim = /* GraphQL */ `
  mutation CreateDailyClaim(
    $input: CreateDailyClaimInput!
    $condition: ModelDailyClaimConditionInput
  ) {
    createDailyClaim(input: $input, condition: $condition) {
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
export const updateDailyClaim = /* GraphQL */ `
  mutation UpdateDailyClaim(
    $input: UpdateDailyClaimInput!
    $condition: ModelDailyClaimConditionInput
  ) {
    updateDailyClaim(input: $input, condition: $condition) {
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
export const deleteDailyClaim = /* GraphQL */ `
  mutation DeleteDailyClaim(
    $input: DeleteDailyClaimInput!
    $condition: ModelDailyClaimConditionInput
  ) {
    deleteDailyClaim(input: $input, condition: $condition) {
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
