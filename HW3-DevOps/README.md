HW-3: REDIS
=========================
## Building Infrastruction - Workshop

In this workshop, I have learned the basics of adding infrastructure components to a web application.

In particular, using redis to construct basic infrastructure components, such as a cache and queue, and intergrating them into a web application.

### Setup and Run
```
git clone https://github.ncsu.edu/skundal/HW3-DevOps.git
cd HW3-DevOps

# if the image queues is not pulled
bakerx pull CSC-DevOps/Images#Spring2020 queues

bakerx run queues queues --ip 192.168.44.81 --sync

bakerx ssh queues

# for task 1 & 2
cd /bakerx/basics
npm install
node main.js

# for task 3, 4 & 5
cd /bakerx/meow.io
npm install 
node data/init.js

# Start server in the background
npm start &
```

**For task 1 and 2 visit:** http://192.168.44.81:3003/

**For task 3, 4 and 5 visit:** http://192.168.44.81:3000/

### Task 1: An expiring cache

- [x] Create two routes, `/get` and `/set`.
- [x] When [`/set`](http://192.168.44.81:3003/set) is visited (i.e. GET request), set a new key, with the value: "this message will self-destruct in 10 seconds".
- [x] Use the [EXPIRE](https://redis.io/commands/expire) command to make sure this key will expire in 10 seconds.
- [x] When [`/get`](http://192.168.44.81:3003/get) is visited (i.e. GET request), fetch that key, and send its value back to the client: `res.send(value)`.

![](https://github.ncsu.edu/skundal/HW3-DevOps/blob/master/resources/t1-1.jpg)
![](https://github.ncsu.edu/skundal/HW3-DevOps/blob/master/resources/t1-2.jpg)
![](https://github.ncsu.edu/skundal/HW3-DevOps/blob/master/resources/t1-3.jpg)


### Task 2: Recent visited sites

- [x] Create a new route, `/recent`, which will display the most recently visited sites.

![](https://github.ncsu.edu/skundal/HW3-DevOps/blob/master/resources/t2.jpg)

*Note: http://192.168.44.81:3003/recent displays 5 recently visited sites before "/recent" was called.*

### Task 3: Cache best facts calculation

- [x] Modify `meow.io/routes/index.js` to cache and return the results of bestFacts. Have cached results expire after 10 seconds. You should see a reduction in load time for the site. 

![](https://github.ncsu.edu/skundal/HW3-DevOps/blob/master/resources/t3-1.jpg)
![](https://github.ncsu.edu/skundal/HW3-DevOps/blob/master/resources/t3-2.jpg)

### Task 4: Cat picture uploads storage
```bash
# To upload cat image
#replace morning.jpg with hairypotter.jpg or i-scream.jpg
curl -F "image=@./data/morning.jpg" http://localhost:3000/upload
```
- [X] Display the 5 most recently uploaded files (/upload) from cache.

![](https://github.ncsu.edu/skundal/HW3-DevOps/blob/master/resources/t4-1.jpg)

### Task 5: Regulate uploads with queue

- [x] Modify the `meow.io/routes/upload.js` to store incoming images in a queue and not the database. Modify `meow.io/app.js` to timer (setInternal every 100ms), to pop images stored in the queue


![](https://github.ncsu.edu/skundal/HW3-DevOps/blob/master/resources/t5-0.png)
![](https://github.ncsu.edu/skundal/HW3-DevOps/blob/master/resources/t5.png)

The screenshots below gives the visual proof that the cache and database contain the same output though the 1st half of both the below screenshots are obtained using the new code which implements caching and the 2nd half of both the screenshots represent the output obtained using the old code which implements getting values from database.

**BEFORE:**

![](https://github.ncsu.edu/skundal/HW3-DevOps/blob/master/resources/t5-before.png)

**AFTER:** running `curl -F "image=@./data/hairypotter.jpg" http://localhost:3000/upload`

![](https://github.ncsu.edu/skundal/HW3-DevOps/blob/master/resources/t5-after.png)

### Screencast
The video link is [here](https://drive.google.com/open?id=1KQgbjuKmu0Qp9CN5jpnYwPVMVsiAVHfg)

## Conceptual Questions

**1. Describe three desirable properties for infrastructure.**

**Ans.** </br>
- Availability: Should be available to the user when ever he/she needs.
- Scalability: The infrastructure should scale up/down depending upon the incoming requests to maintain QoS and money.
- Isolation: Isolating tenant resources such that the confidentiality and integrity of one tenant's data is kept from others.

**2. Describe some benefits and issues related to using Load Balancers.**

**Ans.**  </br>
**Benefits:**
- Ensures that load is distributed to all the servers so that the users doesn't experience lag in their requests.
- Ensures availability of servers i.e., if one server goes down, the requests are served by other servers,

**Issues:**
- Required additional configuration to deploy load balancer.
- Costly if hardware based.

**3. What are some reasons for keeping servers in seperate availability zones?**

**Ans.** </br>
- Ensures availability of data to the user incase of any calamity/ disaster i.e., in events of any natural or man-made disaster at a particular location where the data is stored, the user need not worry about loosing the data since the same data/ server is kept at a different availability zone for resiliency.
- Incase if there is a power outage or maintenance at a particular availability zone, the user can still access his/her data from another server deployed in other availability zone.

**4. Describe the Circuit Breaker and Bulkhead pattern.**

**Ans.** 

**Circuit Breaker:** The circuit breaker pattern is a type of Microservices architecture that helps to create a fault tolerant and resilient systems by handling faults or failures gracefuly. The circuit breaker pattern handles downtime and slowness of key services gracefully and helps those services recover by reducing load.

**Bulkhead pattern:** The Bulkhead pattern is a type of application design that is tolerant of failure. In a bulkhead architecture, elements of an application are isolated into pools so that if one fails, the others will continue to function. 


