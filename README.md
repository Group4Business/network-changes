# network-changes

Detect network changes

## Installation

    npm i network-changes

## Usage

```js
    import { NetworkChanges } from 'network-changes'

    const netChanges = new NetworkChanges();

    netChanges.onChange().subscribe(interfaces => {
        console.log(`Network has changed!`, interfaces);
    });

    netChanges.setTimer(5000); // Check every 5 seconds. Default 4 seconds

    subscription.unsubscribe();

```
