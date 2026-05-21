const squar = (n) => n * n;
console.log(squar(7));
const greet = name => `Hello! ${name}`;
console.log(greet("John"));

const Evenn = (n) => {
    if ((n % 2) == 0) {
        return true;
    } else {
        return false;
    }
};
console.log(Evenn(9));

//Task 3
/*const Counter = {
    count: 0,
    start: function () {

        setInterval(() => {
            this.count++;
            console.log(this.count);
            if (this.count === 0) clearInterval(interval);
        }, 10)


    }
};
Counter.start();*/

//Task 4 

const apiResponse = {
    status: 200,
    data: {
        user: {
            id: "123Prabhas",
            name: "Prabhas",
            phone_no: 630932,
            email: "prabh@gamil.com",
            role: "Developer",
            address: {
                city: "ATP",
                state: "AP"
            }

        }
    }
};

const formatUser = () => {
    const bio = {
        first_name: "prabhas",
        Last_name: "Pasula",
        country: "India"
    };
    return bio;
};
formatUser();

const dispalyBio = ({ first_name, Last_name, country }) => {
    console.log(`${first_name} ${Last_name} from ${country}`);

};
dispalyBio(formatUser());