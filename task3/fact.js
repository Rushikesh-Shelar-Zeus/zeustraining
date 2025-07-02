function factorial(num) {
    let fact = [1];

    if (num === 0 || num === 1) {
        return fact;
    }

    for (let i = 1; i <= num; i++) {
        fact = multiply(fact, i);
    }

    console.log(fact.length)
    return fact;
}


function multiply(arr, num) {
    let result = [];
    let carryDigit = 0;

    for (let i = arr.length - 1; i >= 0; i--) {
        let multiple = arr[i] * num;
        // console.log(arr[i], "x", num)
        // console.log("multiple:",multiple)
        // console.log("Carry:",carryDigit)
        
        let exact = multiple + carryDigit;
        result.unshift(exact % 10);
        // console.log("exact:", exact)
        // console.log(`result:`, result)
        carryDigit = Math.floor(exact / 10);
        // console.log("Carry Forward", carryDigit)
    }

    while (carryDigit > 0){
        result.unshift(carryDigit%10);
        carryDigit = Math.floor(carryDigit/10);
    }
    
    return result;
}

function main(){
    let result = factorial(1000);
    console.log(result);
}

main();

