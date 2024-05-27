from pages.main_page import MainPage


def test_main_page_displayed(driver):
    main_page = MainPage(driver)
    main_page.wait_for_seconds(3)
    assert main_page.is_main_page_displayed(), "Verificação falhou: A página não está visível"

def test_board_displayed(driver):
    board_page = MainPage(driver)
    board_page.wait_for_seconds(2)
    assert board_page.is_board_displayed(), "Verificação falhou: O tabuleiro não está visível"

def test_black_pieces_displayed(driver):
    black_pieces = MainPage(driver)
    assert black_pieces.is_black_pieces_displayed(), "Verificação falhou: O tabuleiro não contém o número esperado de peças pretas."

def test_red_pieces_displayed(driver):
    black_pieces = MainPage(driver)
    assert black_pieces.is_red_pieces_displayed(), "Verificação falhou: O tabuleiro não contém o número esperado de peças vermelhas."

def test_rules_displayed(driver):
    rules_page = MainPage(driver)
    rules_page.is_rules_displayed(), "Verificação falhou: Não foi possível verificar as regras"

def test_piece_move(driver):
    pieces_move = MainPage(driver)
    pieces_move.piece_move(3,2,4,3), "Verificação falhou: Não foi possível mover a peça"