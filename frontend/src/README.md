# SkillQuest Backend API

## Endpoints

### **User Routes**
- **POST /api/users/register**
  - **Description**: Register a new user.
  - **Body**: 
    ```json
    { "username": "string", "password": "string" }
    ```
  - **Response**: 
    ```json
    { "message": "User registered", "username": "string" }
    ```

- **POST /api/users/register-admin**
  - **Description**: Register a new admin user (requires admin key).
  - **Body**: 
    ```json
    { "username": "string", "password": "string", "adminKey": "string" }
    ```
  - **Response**: 
    ```json
    { "message": "Admin registered", "username": "string" }
    ```

- **POST /api/users/login**
  - **Description**: Log in a user and return a JWT token.
  - **Body**: 
    ```json
    { "username": "string", "password": "string" }
    ```
  - **Response**: 
    ```json
    { 
      "token": "string", 
      "user": { 
        "username": "string", 
        "essence": number, 
        "rank": "string", 
        "completedChallenges": array, 
        "isAdmin": boolean 
      } 
    }
    ```

- **GET /api/users/leaderboard**
  - **Description**: Get the top 5 users by essence.
  - **Response**: 
    ```json
    [
      { "username": "string", "essence": number, "rank": "string" },
      ...
    ]
    ```

---

### **Challenge Routes**
- **GET /api/challenges**
  - **Description**: Get all approved challenges.
  - **Response**: 
    ```json
    [
      { 
        "_id": "string", 
        "title": "string", 
        "description": "string", 
        "skill": "string", 
        "difficulty": "string", 
        "essenceReward": number, 
        "status": "string", 
        "createdBy": "string" 
      },
      ...
    ]
    ```

- **GET /api/challenges/pending** (Authenticated, Admin Only)
  - **Description**: Get all pending challenges.
  - **Headers**: 
    ```
     BearAuthorization:er <token>
    ```
  - **Response**: Same as above, but for pending challenges.

- **POST /api/challenges/create** (Authenticated)
  - **Description**: Create a new challenge.
  - **Headers**: 
    ```
    Authorization: Bearer <token>
    ```
  - **Body**: 
    ```json
    { 
      "title": "string", 
      "description": "string", 
      "skill": "string", 
      "difficulty": "string", 
      "essenceReward": number 
    }
    ```
  - **Response**: 
    ```json
    { "message": "Challenge created, awaiting approval" }
    ```

- **POST /api/challenges/approve** (Authenticated, Admin Only)
  - **Description**: Approve or reject a challenge.
  - **Headers**: 
    ```
    Authorization: Bearer <token>
    ```
  - **Body**: 
    ```json
    { "challengeId": "string", "action": "approve|reject" }
    ```
  - **Response**: 
    ```json
    { "message": "Challenge approved/rejected" }
    ```

- **POST /api/challenges/complete** (Authenticated)
  - **Description**: Complete a challenge.
  - **Headers**: 
    ```
    Authorization: Bearer <token>
    ```
  - **Body**: 
    ```json
    { "challengeId": "string" }
    ```
  - **Response**: Updated user object.