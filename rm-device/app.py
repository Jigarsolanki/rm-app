from socketIO_client import SocketIO, LoggingNamespace
import RPi.GPIO as GPIO
from time import sleep
import signal
import sys
import atexit

def main():
	Motor1A = 16
	Motor1B = 18
	Motor2A = 19
	Motor2B = 21

	def set_up():
		GPIO.setmode(GPIO.BOARD)
		
		GPIO.setup(Motor1A, GPIO.OUT)
		GPIO.setup(Motor1B, GPIO.OUT)
		GPIO.setup(Motor2A, GPIO.OUT)
		GPIO.setup(Motor2B, GPIO.OUT)
	
	def on_ready():
		print "Ready"
	
	def move_forward():
		print "moving forward"
		GPIO.output(Motor1A, GPIO.LOW)
		GPIO.output(Motor1B, GPIO.HIGH)
		GPIO.output(Motor2A, GPIO.LOW)
		GPIO.output(Motor2B, GPIO.HIGH)
	
	def move_backward():
		print "moving backward"
		GPIO.output(Motor1A, GPIO.HIGH)
		GPIO.output(Motor1B, GPIO.LOW)
		GPIO.output(Motor2A, GPIO.HIGH)
		GPIO.output(Motor2B, GPIO.LOW)
	
	def move_right():
		print "moving right"
		GPIO.output(Motor1A, GPIO.LOW)
		GPIO.output(Motor1B, GPIO.HIGH)
		GPIO.output(Motor2A, GPIO.HIGH)
		GPIO.output(Motor2B, GPIO.LOW)
	
	def move_left():
		print "moving left"
		GPIO.output(Motor1A, GPIO.HIGH)
		GPIO.output(Motor1B, GPIO.LOW)
		GPIO.output(Motor2A, GPIO.LOW)
		GPIO.output(Motor2B, GPIO.HIGH)
	
	def on_move(*args):
		command = str(args[0])
		
		if command == 'F':
			move_forward()
		elif command == 'B':
			move_backward()		
		elif command == 'L':
			move_left()
		elif command == 'R':
			move_right()

	def on_stop(*args):
		print "stopping"
		GPIO.output(Motor1A, GPIO.LOW)
		GPIO.output(Motor1B, GPIO.LOW)
		GPIO.output(Motor2A, GPIO.LOW)
		GPIO.output(Motor2B, GPIO.LOW)
	
	def clean_gpio(): 
		GPIO.cleanup()
	
	set_up()
	atexit.register(clean_gpio)
	
	socketIO = SocketIO('192.168.1.151', 3000)
	socketIO.emit('register', 'device')
	socketIO.on('ready', on_ready)
	socketIO.on('move', on_move)
	socketIO.on('stop', on_stop)
	socketIO.wait()

if __name__ == "__main__":
	main()
