def getRandomLink():
    linkReader = open('./defaults/links.txt', 'r')
    linkList = linkReader.readlines()
    from random import randint    
    r = (randint(0,(len(linkList)-1)))
    #print linkList[r]
    return linkList[r]
