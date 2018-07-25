import { NetworkChanges, NetworkInterfaces } from './src/network-changes'

const netChanges = new NetworkChanges();
let count = 0;

function printInterfaces(ifs: NetworkInterfaces){
    let count = 0;
    console.log('Interfaces:');
    for (const key in ifs) {
        for (const info of ifs[key]) {
            console.log(` ${++count})`, key, info.address);
        }
    }
}

const subscription = netChanges.onChange().subscribe(interfaces => {
    console.log('\x1B[2J\x1B[0f');
    console.log(`Network has changed! ${++count}`);
    printInterfaces(interfaces);
    if (count >= 10) {
        subscription.unsubscribe();
    }
});

console.log('\x1B[2J\x1B[0f');
console.log(`Network Changes started!`);
printInterfaces(netChanges.getInterfaces());