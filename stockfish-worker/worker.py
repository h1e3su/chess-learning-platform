import pika
import json
import subprocess
import os

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_USER = os.getenv("RABBITMQ_USER", "root")
RABBITMQ_PASS = os.getenv("RABBITMQ_PASS", "rootpassword")

STOCKFISH_PATH = "stockfish"

def get_best_move(fen, move_time_ms, skill_level):
    try:
        # Start stockfish
        process = subprocess.Popen(
            [STOCKFISH_PATH],
            universal_newlines=True,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        # Set skill level
        process.stdin.write(f"setoption name Skill Level value {skill_level}\n")
        
        # Set position
        process.stdin.write(f"position fen {fen}\n")
        
        # Calculate move
        process.stdin.write(f"go movetime {move_time_ms}\n")
        process.stdin.flush()
        
        best_move = None
        
        # Read output until bestmove is found
        for line in process.stdout:
            line = line.strip()
            if line.startswith("bestmove"):
                parts = line.split(" ")
                if len(parts) >= 2:
                    best_move = parts[1]
                break
                
        # Clean up
        process.stdin.write("quit\n")
        process.stdin.flush()
        process.wait(timeout=2)
        
        return best_move
    except Exception as e:
        print(f"Error executing stockfish: {e}")
        return None

def on_request(ch, method, props, body):
    try:
        request = json.loads(body.decode("utf-8"))
        fen = request.get("fen")
        move_time_ms = request.get("moveTimeMs", 1000)
        skill_level = request.get("skillLevel", 10)
        
        print(f"[*] Received request for FEN: {fen}")
        
        best_move = get_best_move(fen, move_time_ms, skill_level)
        
        print(f"[*] Best move calculated: {best_move}")
        
        response = best_move if best_move else "error"
        
        ch.basic_publish(
            exchange='',
            routing_key=props.reply_to,
            properties=pika.BasicProperties(correlation_id=props.correlation_id),
            body=json.dumps(response)
        )
        ch.basic_ack(delivery_tag=method.delivery_tag)
        print("[*] Replied to client.")
    except Exception as e:
        print(f"Error handling request: {e}")
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)

def main():
    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS)
    parameters = pika.ConnectionParameters(RABBITMQ_HOST, 5672, '/', credentials)
    
    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()
    
    # Declare the queue just in case it doesn't exist yet
    channel.queue_declare(queue='stockfish.jobs.queue', durable=True)
    
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue='stockfish.jobs.queue', on_message_callback=on_request)
    
    print(" [x] Awaiting RPC requests on stockfish.jobs.queue")
    channel.start_consuming()

if __name__ == "__main__":
    main()
