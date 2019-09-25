module.exports = {
    // search for questions
    search: `query SearchQuery($query: String!, $first: Int!, $after: ID) {
        questionSearch(query: $query, first: $first, after: $after) {
            count
            edges {
                node {
                    id
                    content
                    points
                    created
                    lastActivity
                    author {
                        id
                        databaseId
                        nick
                        points
                        gender
                        description
                        isDeleted
                        avatar {
                            id
                            databaseId
                            url
                            thumbnailUrl
                            extension
                        }
                        category
                        clientType
                        rank {
                            id
                            databaseId
                            name
                        }
                        receivedThanks
                        bestAnswersCount
                        helpedUsersCount
                    }
                    isAuthorsFirstQuestion
                    canBeAnswered
                    pointsForAnswer
                    pointsForBestAnswer
                    answers {
                        nodes {
                            id
                            content
                            points
                            isBest
                            created
                            rating
                            ratesCount
                            thanksCount
                            author {
                                id
                                databaseId
                                nick
                                points
                                gender
                                description
                                isDeleted
                                avatar {
                                    id
                                    databaseId
                                    url
                                    thumbnailUrl
                                    extension
                                }
                                category
                                clientType
                                rank {
                                    id
                                    databaseId
                                    name
                                }
                                receivedThanks
                                bestAnswersCount
                                helpedUsersCount
                            }
                        }
                    }
                }
            }
        }
    }`,
    // get question by id
    getQuestionByID: `query getQuestionByID($id: Int!) {
        questionById(id: $id) {
            id
            content
            points
            created
            lastActivity
            author {
                id
                databaseId
                nick
                points
                gender
                description
                isDeleted
                avatar {
                    id
                    databaseId
                    url
                    thumbnailUrl
                    extension
                }
                category
                clientType
                rank {
                    id
                    databaseId
                    name
                }
                receivedThanks
                bestAnswersCount
                helpedUsersCount
            }
            isAuthorsFirstQuestion
            canBeAnswered
            pointsForAnswer
            pointsForBestAnswer
            answers {
                nodes {
                    id
                    content
                    points
                    isBest
                    created
                    rating
                    ratesCount
                    thanksCount
                    author {
                        id
                        databaseId
                        nick
                        points
                        gender
                        description
                        isDeleted
                        avatar {
                            id
                            databaseId
                            url
                            thumbnailUrl
                            extension
                        }
                        category
                        clientType
                        rank {
                            id
                            databaseId
                            name
                        }
                        receivedThanks
                        bestAnswersCount
                        helpedUsersCount
                    }
                }
            }
        }
    }`
}