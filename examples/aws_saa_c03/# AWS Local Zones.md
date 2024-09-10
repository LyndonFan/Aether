# AWS Local Zones

## Key Concepts

- **“1”** zone - so **no built in resilience**
- Think of them **like an AZ**, but **near your location**
- They are **closer** to you - so **lower** latency
- Not all products support them - many are opt in w/ limitations
- DX to a local zone IS support (extreme performance needs)
- Utilize **parent region** - i.e. **EBS Snapshots** are TO parent
- Use Local zones when you need **THE HIGHEST** performance ❗

## AWS w/o Local Zones

![Untitled](img/Untitled%20245.png)

## AWS w/ Local Zones

![Untitled](img/Untitled%20246.png)
