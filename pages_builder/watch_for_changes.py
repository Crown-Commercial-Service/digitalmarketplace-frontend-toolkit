# coding=utf-8
from time import sleep
from termcolor import cprint
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler
from generate_pages import Styleguide_publisher


class PublishDocumentationHandler(PatternMatchingEventHandler):
    patterns = ['*.yml', '*.scss', '*.js', '*.html', '*.png']

    def process(self, event):
        try:
            Styleguide_publisher()
            cprint('\n✔ Pages have been rebuilt because {} was {}\n'.format(
                event.src_path, event.event_type
            ), 'green')
        except Exception as error:
            cprint('\n✖ {}\n'.format(
                error
            ), 'red')

    def on_modified(self, event):
        self.process(event)

    def on_created(self, event):
        self.process(event)


if __name__ == '__main__':

    paths_to_watch = ['./toolkit', './pages_builder/assets', './pages_builder/pages']

    cprint('\nWatching for changes to files in {}'.format(
        ", ".join(paths_to_watch)
    ), 'yellow')

    observer = Observer()

    for path in paths_to_watch:
        observer.schedule(PublishDocumentationHandler(), path, recursive=True)

    observer.start()

    try:
        while True:
            sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()
