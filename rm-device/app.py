from socketIO_client import SocketIO, LoggingNamespace

def main():
    def on_ready():
        print "Ready"

    def move_forward():
        print "Move Forward"

    def move_back():
        print "Move back"

    def move_left():
        print "Move left"

    def move_right():
        print "Move right"

    def on_move(*args):

        if
        print ("MOVE", args[0])

    def on_stop(*args):
        print "STOP"

    socketIO = SocketIO('localhost', 3000)
    socketIO.emit('register', 'device')
    socketIO.on('ready', on_ready)
    socketIO.on('move', on_move)
    socketIO.on('stop', on_stop)
    socketIO.wait()

if __name__ == "__main__":
    main()
