import multiprocessing

workers = multiprocessing.cpu_count() * 2 + 1
workers = 1
accesslog = "-" # STDOUT
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(q)s" "%(D)s"'
bind = "0.0.0.0:5000"
log_level = "debug"
keepalive = 120
timeout = 120
worker_class = "gthread"
threads = 3
