import * as os from 'os'

interface NetworkInterfaceBase {
  address: string
  netmask: string
  mac: string
  internal: boolean
}

interface NetworkInterfaceInfoIPv4 extends NetworkInterfaceBase {
  family: 'IPv4'
}

interface NetworkInterfaceInfoIPv6 extends NetworkInterfaceBase {
  family: 'IPv6'
  scopeid: number
}

export type NetworkInterfaceInfo =
  | NetworkInterfaceInfoIPv4
  | NetworkInterfaceInfoIPv6

export type NetworkInterfaces = { [key: string]: NetworkInterfaceInfo[] }

interface SNCHandler {
  fn: (interfaces: NetworkInterfaces) => void
}

class StaticNetworkChanges {
  private static isRunning = false
  private static TIMEOUT_CHECK_MS = 4000
  private static intervalId: any
  private static handlers: SNCHandler[] = []
  private static lastInterfacesSer = ''

  private static checkInterfaces() {
    const interfaces = os.networkInterfaces() as NetworkInterfaces
    const interfacesSer = JSON.stringify(interfaces)
    if (interfacesSer !== this.lastInterfacesSer) {
      this.lastInterfacesSer = interfacesSer
      return interfaces
    } else {
      return null
    }
  }

  private static start() {
    if (this.isRunning) return
    this.isRunning = true
    clearInterval(this.intervalId)
    this.checkInterfaces()
    this.intervalId = setInterval(() => {
      const changedInterfaces = this.checkInterfaces()
      if (changedInterfaces != null) {
        this.handlers.forEach(handler => {
          handler.fn(changedInterfaces)
        })
      }
    }, this.TIMEOUT_CHECK_MS)
  }

  private static stop() {
    clearInterval(this.intervalId)
    this.isRunning = false
  }

  static addHandler(handler: SNCHandler) {
    this.handlers.push(handler)
    this.start()
  }

  static removeHandler(handler: SNCHandler) {
    this.handlers.splice(this.handlers.indexOf(handler), 1)
    if (this.handlers.length <= 0) {
      this.stop()
    }
  }

  static setTimer(timeMs: number) {
    this.TIMEOUT_CHECK_MS = timeMs
    this.stop()
    this.start()
  }
}

export class NetworkChanges {
  static setTimer = StaticNetworkChanges.setTimer

  getInterfaces() {
    return os.networkInterfaces() as NetworkInterfaces
  }

  onChange() {
    return {
      subscribe: (fn: (interfaces: NetworkInterfaces) => void) => {
        const handler: SNCHandler = { fn }
        StaticNetworkChanges.addHandler(handler)
        return {
          unsubscribe: () => {
            StaticNetworkChanges.removeHandler(handler)
          }
        }
      }
    }
  }
}
