import urllib.request
import urllib.parse
import names
import faker
import random
import json
from enum import Enum

class methods(Enum):
    newUser = 0
    newCommunity = 1
    newUserCommunity = 2
    newGroupCommunity = 3
    login = 4

prop={"port":"3001","address":"http://localhost:"}

routes={ 
    methods.newUser: '/newUser',
    methods.newCommunity: '/newCommunity',
    methods.newUserCommunity: '/newUserCommunity',
    methods.newGroupCommunity: '/newGroupCommunity',
    methods.login: '/login'
    }

def loginUser(user):
    body= {"nick":user["nick"],"password":user["password"]}
    print(body)
    params = urllib.parse.urlencode(body).encode("utf-8")
    try:
        f = urllib.request.urlopen(prop['address']+prop['port']+routes[methods.login], params)
    except urllib.error.HTTPError as err:
        print(err.code)
        print(f.read())
            
    return json.loads(f.read().decode('utf-8'))

def createUsers(users):
    for user in users:        
        params = urllib.parse.urlencode(user).encode("utf-8")        
        try:
            f = urllib.request.urlopen(prop['address']+prop['port']+routes[methods.newUser], params)
        except urllib.error.HTTPError as err:
            print(err.code,err.read())
            print("error with",user)
        print(f.read())
        print("\n")
        
        
def createCommunities(users,communities):   
    for community in communities:              
        params = urllib.parse.urlencode(community).encode("utf-8")     
        header = {"authorization":loginUser(users[random.randint(0,len(users))])["token"]}
        try:             
            req = urllib.request.Request(prop['address']+prop['port']+routes[methods.newCommunity], headers=header, method='POST')
            res = urllib.request.urlopen(req, params)
            print(res.read())
            print("\n")
        except urllib.error.HTTPError as err:
            print(err.code)
            print("error with",community)
        
        
def generateUsers(amount):
    users=[ ]
    for user in range(amount):
        gender='female' if random.randint(0,1) else 'male'
        name = names.get_first_name(gender)
        users.append(
            {
                "email":  name+"@email.com",
                "nick": name+name[0:len(name)-1]+str(random.randint(0,10)),
                "gender":"F" if gender=="female" else "M",
                "name": name,
                "last_name":names.get_last_name(),
                "password": name+"1234"                
            })
    return users
        
def generateCommunities(amount): 
    communities=[ ]
    for community in range(amount):        
        name = names.get_last_name()+"Inc"
        title = name + "Group"
        description= faker.Faker().text()
        privacy= "PUBLIC" if random.randint(0,1) else "OPEN"                
        communities.append(
            {
                "name":  name,
                "title": title,
                "description":description,
                "privacy": privacy             
            })
    return communities
    
users = generateUsers(10)
createUsers(users)

communities = generateCommunities(10)
createCommunities(users, communities)
