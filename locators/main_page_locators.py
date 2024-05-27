from selenium.webdriver.common.by import By

class MainPageLocators:
     MAIN_PAGE = (By.ID, "container")
     BOARD = (By.ID, "board")
     CELL = (By.CLASS_NAME, "cell dark")
     BLACK_PIECES = (By.XPATH, "//div[@class='piece black']")
     RED_PIECES = (By.XPATH, "//div[@class='piece red']")
     SELECTED_PIECES = (By.XPATH, '//*[@id="board"]/div[22]/div')
     RULES = (By.ID, "info")
     @staticmethod
     def start_position(row, col):
          return (By.CSS_SELECTOR, f'div[data-row="{row}"][data-col="{col}"] .piece.black')

     @staticmethod
     def final_position(row, col):
          return (By.CSS_SELECTOR, f'div[data-row="{row}"][data-col="{col}"]')
      