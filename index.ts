interface IpcPacket {
    channel: string;
    args: any[];
}

class IpcRenderer {
    onListeners: { [channel: string]: ((...args: any[]) => void)[] };
    onceListeners: { [channel: string]: ((...args: any[]) => void)[] };

    constructor() {
        this.onListeners = {};
        this.onceListeners = {};
    };

    on(channel: string, handler: (...args: any[]) => void): void {
        if (!this.onListeners[channel])
            this.onListeners[channel] = [];
        this.onListeners[channel].push(handler);
    }

    once(channel: string, handler: (...args: any[]) => void): void {
        if (!this.onceListeners[channel])
            this.onceListeners[channel] = [];
        this.onceListeners[channel].push(handler);
    }

    emit(channel: string, ...args: any[]): void {
        if (this.onListeners[channel])
            for (const listener of this.onListeners[channel])
                listener(...args);
        if (this.onceListeners[channel])
            for (const listener of this.onceListeners[channel])
                listener(...args);
        this.onceListeners[channel] = [];
    }
}

const ipcRenderer = new IpcRenderer();

window.addEventListener("ipc", (event: CustomEvent) => {
    console.log("ipc");
    console.log(event.detail.json);
    const packet: IpcPacket = JSON.parse(event.detail.json);
    ipcRenderer.emit(packet.channel, ...packet.args);
});

ipcRenderer.on("ipc10", (args: any, ..._: any[]) => {
    console.log("ipc10");
    console.log(JSON.stringify(args));
});
