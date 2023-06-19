import os
import subjectRandom
import linkRandom

f = open('./templates/official/content.html', 'wb')

def getSubjectHeader():
    subject = subjectRandom.getRandomSubject(1)
    return subject
def getRandomLink():
    link = linkRandom.getRandomLink()
    return link
def constructParagraph():
    pReader = open('./templates/official/paraContent.txt', 'r')
    pList = pReader.readlines()
    from random import randint    
    r = (randint(0,(len(pList)-1)))
    return pList[r]
def constructCTA():
    cReader = open('./templates/official/ctaText.txt', 'r')
    cList = cReader.readlines()
    from random import randint    
    r = (randint(0,(len(cList)-1)))
    return cList[r]
def constructTable():
    #get first table
    f1 = open('./templates/official/firstTable.html', 'r')
    part1 = f1.read()
    f.write(part1)

    #insert header
    subjHeader = getSubjectHeader()
    f.write(subjHeader)

    #get second table
    f2 = open('./templates/official/secondTable.html', 'r')
    part2 = f2.read()
    f.write(part2)

    #insert paragraph
    p1 = constructParagraph()
    f.write(p1)
    p2 = constructParagraph()
    f.write(p2)

    #insert cta button
    f3 = open('./templates/official/ctaButton.html', 'r')
    part3 = f3.read()
    f.write(part3)
    
    link = getRandomLink()
    f.write(link)
    closeLink = "\" style=\"text-decoration: none;\">"
    f.write(closeLink)
    
    f3a = open('./templates/official/ctaButton2.html', 'r')
    part3a = f3a.read()
    f.write(part3a)
    
    cta = constructCTA()
    f.write(cta)
    closeCta = "</div></a>"
    f.write(closeCta)

    #insert third table
    f4 = open('./templates/official/thirdTable.html', 'r')
    part2 = f2.read()
    f.write(part2)

    #insert paragraph
    p3 = constructParagraph()
    f.write(p3)

    #insert fourth table
    f5 = open('./templates/official/fouthTable.html', 'r')
    part5 = f5.read()
    f.write(part5)

    f1.close()
    f2.close()
    f3.close()
    f4.close()
    f5.close()

def main():
    constructTable()
    f.close()

main()

    
    

    
