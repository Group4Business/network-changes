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

    netChanges.set

    subscription.unsubscribe();

```
