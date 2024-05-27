from .base_page import BasePage
from locators.main_page_locators import MainPageLocators
from selenium.webdriver.common.action_chains import ActionChains
import time

class MainPage(BasePage):
    def is_main_page_displayed(self):
        return self.is_element_visible(*MainPageLocators.MAIN_PAGE)
    
    def is_board_displayed(self):
        return self.is_element_visible(*MainPageLocators.BOARD)
    
    def is_black_pieces_displayed(self):
        black_pieces = self.find_element(*MainPageLocators.BLACK_PIECES)
        print(f"Número de peças pretas encontradas: {len(black_pieces)}")
        if black_pieces and len(black_pieces) == 12:
            print("Verificação bem-sucedida: O tabuleiro contém 12 peças pretas.")
            return True
        
    def is_red_pieces_displayed(self):
        red_pieces = self.find_element(*MainPageLocators.RED_PIECES)
        print(f"Número de peças vermelhas encontradas: {len(red_pieces)}")
        if red_pieces and len(red_pieces) == 12:
            print("Verificação bem-sucedida: O tabuleiro contém 12 peças vermelhas.")
            return True
        
    def is_rules_displayed(self):
        return self.is_element_visible(*MainPageLocators.RULES)
    
    def piece_move(driver, x1, y1, x2, y2):
        try:
            # Encontre a peça preta na posição inicial
            pos_inicial = f'div[data-row="{x1}"][data-col="{y1}"] .piece.black'
            peca = driver.find_element(By.CSS_SELECTOR, pos_inicial)

            # Encontre a posição final desejada
            pos_final = f'div[data-row="{x2}"][data-col="{y2}"]'
            destino = driver.find_element(By.CSS_SELECTOR, pos_final)

            # Verifique se a posição final está vazia
            if len(destino.find_elements(By.CLASS_NAME, 'piece')) == 0:
                # Mova a peça usando ActionChains
                acoes = ActionChains(driver)
                acoes.drag_and_drop(peca, destino).perform()

                # Aguarde um momento para verificar o movimento
                time.sleep(2)

                # Verifique se a peça foi movida para a posição correta
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