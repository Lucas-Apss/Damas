from .base_page import BasePage
from locators.main_page_locators import MainPageLocators
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
import time

class MainPage(BasePage):
    def is_main_page_displayed(self):
        try:
            return self.is_element_visible(*MainPageLocators.MAIN_PAGE)
        except Exception as e:
            print(f"Ocorreu um erro: {e}")
            return False
    
    def is_board_displayed(self):
        try:
            return self.is_element_visible(*MainPageLocators.BOARD)
        except Exception as e:
            print(f"Ocorreu um erro: {e}")
            return False
    
    def is_black_pieces_displayed(self):
        try:
            black_pieces = self.find_element(*MainPageLocators.BLACK_PIECES)
            print(f"Número de peças pretas encontradas: {len(black_pieces)}")
            if black_pieces and len(black_pieces) == 12:
                print("Verificação bem-sucedida: O tabuleiro contém 12 peças pretas.")
                return True
        except Exception as e:
            print(f"Ocorreu um erro: {e}")
            return False
        
    def is_red_pieces_displayed(self):
         try:
            red_pieces = self.find_element(*MainPageLocators.RED_PIECES)
            print(f"Número de peças vermelhas encontradas: {len(red_pieces)}")
            if red_pieces and len(red_pieces) == 12:
                print("Verificação bem-sucedida: O tabuleiro contém 12 peças vermelhas.")
                return True
         except Exception as e:
            print(f"Ocorreu um erro: {e}")
            return False
        
    def is_rules_displayed(self):
        try:
            return self.is_element_visible(*MainPageLocators.RULES)
        except Exception as e:
            print(f"Ocorreu um erro: {e}")
            return False
    
    def piece_move(driver, x1, y1, x2, y2):
        try:
            # Encontre a peça preta na posição inicial
            peca = driver.find_element(*MainPageLocators.START_POSITION)
            # Encontre a posição final desejada
            destino = driver.find_element(*MainPageLocators.FINAL_POSITION)
            if len(destino.find_elements(By.CLASS_NAME, 'piece')) == 0:
                acoes = ActionChains(driver)
                acoes.drag_and_drop(peca, destino).perform()
                time.sleep(2)
                nova_posicao = destino.find_elements(By.CSS_SELECTOR, '.piece.black')
                if len(nova_posicao) > 0:
                    print("Movimento realizado com sucesso!")
                    return True
                else:
                    print("Não foi possível mover a peça para a posição desejada.")
                    return False
            else:
                print("A posição final já está ocupada.")
                return False

        except Exception as e:
            print(f"Ocorreu um erro: {e}")
            return False