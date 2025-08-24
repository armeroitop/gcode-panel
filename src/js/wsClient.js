

export class WSClient {

    constructor(url) {
        this.conn = new WebSocket(url);

        this.conn.onerror = (e) => {
            console.error('WebSocket error:', e);
            // Aquí puedes decidir si quieres hacer algo más
        };

        this.conn.onclose = (e) => {
            console.warn('WebSocket closed:', e);
            document.dispatchEvent(new Event("wsDesconectado"));
        }

    }

    onOpen(callback) {
        this.conn.onopen = callback;
    }

    onMessage(callback) {
        this.conn.onmessage = (e) => {
            callback(e.data);
        };
    }



    send(message) {
        if (this.conn.readyState !== WebSocket.OPEN) {
            console.error("WebSocket is not open. Ready state: " + this.conn.readyState);
            return;
        }
        this.conn.send(message);
    }
}


