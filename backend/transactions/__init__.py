from .management import scheduler
import threading

# Lock for thread safety
scheduler_lock = threading.Lock()

print("INIT FOR TRANSACTION")

# Check if the scheduler is already running
if not scheduler.scheduler.running:
    # Acquire the lock before starting the scheduler
    with scheduler_lock:
        # Check again inside the lock to avoid race conditions
        if not scheduler.scheduler.running:
            scheduler.scheduler.start()
