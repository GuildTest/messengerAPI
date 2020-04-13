# messengerAPI

### Intro

I started with a much more ambitious project but scaled down to stay within the half-hour scope (took me 6h to be honest). So it is obviously missing a lot, namely a dataloader and some unit tests to only state the most obvious.
I decided to stop with something working where you can actually do some stuff.

How it works : I decided to create 'groups' instead of 'conversation' to because I wanted to build something that can handle 3, 4, n number of people chatting. A simple conversation being a group of only 2.

Basically people can send to a group they belong to and everyone belonging to the group can get all messages from that group with sender information (suscription is missing but that would be next step).

You can filter `first` x number of message OR all message `since` a specific date OR both.
There a `PageInfo` that will inform you if there is or not more data downloadable.

### Technical details

This is done combining [`Babel`](https://babeljs.io/docs/en/) and [`Typecript`](https://www.typescriptlang.org/docs/home.html) on a [`Node.js`](https://nodejs.org/en/docs/) server with [`Apollo`](https://www.apollographql.com/docs/) for the GraphQL interface.
This is purely backend. No Front has been done.

### Install requirements

You must install these tools if not already there:

1. [`Node.js`](https://nodejs.org/en/download/)
2. [`MongoDB`](https://docs.mongodb.com/manual/installation/): You need to have a working mongoDB setup

### Setup your environment

To start your environment you'll just need to set DB_PATH in `.env` file :

1. `DB_PATH`: default is mongodb://localhost:27017/guild modify it to whatever mongodb env you have availble

### Start the application for the first time

You need to run `loadInit` to preload dummy data to play with

```shell
npm install
npm run-script loadInit
npm start
```

Then the PlayGround should be available for your entertainment at [`localhost:8000/graphql`](http://localhost:8000/graphql)

## How-To

By default you have 3 users : Kevin, Mike and Jack.
And you are `Kevin`.
This is harcoded in `src/index.ts` :

```shell
line 8: const name = "kevin";
```

You can change to `Mike`, `Jack` or any other user you want to create after (see below how) by changing this line and save.

### Mutations

There is 3 mutation that should allow you to create more content :

1. `createUser(object: CreateUserInput)`
2. `createGroup(object: CreateGroupInput)`
3. `createMessage(object: CreateMessageInput)`

Here is an example of creating a new user:

```shell
mutation{
  createUser(object:{
    name:”jimmy”,
    password:”password”
  }) {
    success
    user{
      id
      name
      createdAt
    }
  }
}
```

### Queries

There is 3 mutation that should allow you to create more content :

1. `getAllUsers`
2. `recentMessage(first: Int, since: DateTime)`
3. `recentGroup(first: Int, since: DateTime)`

Here is a few example of queries you can make, feel free to make your own using the documentation:

Get all users :

```shell
{
  getAllUsers{
    id
    name
    password
  }
}
```

The last 10 message you sent after "2020-04-13 04:30:00" :

```shell
{
  recentMessage(first:10, since:"2020-04-13T04:30:00.449Z") {
    pageInfo{
      hasNextPage
    }
    nodes{
      id
      content
      createdAt
      group{
        name
        participant{
          id
        	name
        }
      }
      sender{
        id
        name
      }
    }
  }
}
```

All message sent and received in all groups since "2020-04-13 04:30:00" :

```shell
{
  recentGroup{
    pageInfo{
      hasNextPage
    }
    nodes{
      id
      name
      createdAt
      MessageConnection(since:"2020-04-13T04:30:00.449Z"){
        pageInfo{
          hasNextPage
        }
        nodes{
          id
          createdAt
          content
        }
      }
    }
  }
}
```
