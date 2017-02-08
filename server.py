from SimpleHTTPServer import SimpleHTTPRequestHandler
from SocketServer import ThreadingMixIn
from BaseHTTPServer import HTTPServer, BaseHTTPRequestHandler


PORT = 8000


class MultiThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    pass


httpd = MultiThreadedHTTPServer(("", PORT), SimpleHTTPRequestHandler)
print("serving at port {}".format(PORT))
httpd.serve_forever()
