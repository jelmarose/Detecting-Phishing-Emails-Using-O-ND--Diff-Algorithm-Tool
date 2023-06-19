import os
import subjectRandom
import linkRandom

f = open('./templates/promotional/content.html', 'wb')

def browseDir():
    dirList = os.listdir("./templates/promotional")
    from random import randint    
    r = (randint(0,(len(dirList)-1)))
    print dirList[r]
    #print dirList

def getSubjectHeader():
    subject = subjectRandom.getRandomSubject(0)
    return subject

def getRandomMainImg():
    imgList = open('./templates/promotional/main.txt', 'r')
    randImg = imgList.readlines()
    from random import randint    
    r = (randint(0,(len(randImg)-1)))
    return randImg[r]

def getRandomStoreImg():
    imgList = open('./templates/promotional/store.txt', 'r')
    randImg = imgList.readlines()
    from random import randint    
    r = (randint(0,(len(randImg)-1)))
    return randImg[r]

def getRandomLink():
    link = linkRandom.getRandomLink()
    return link

def constructFirstTable():
    ##
    #get firstTable-1.html
    f1 = open('./templates/promotional/firstTable-1.html', 'r')
    part1 = f1.read()
    f.write(part1)

    #get random main image
    mainImg = getRandomMainImg()
    f.write(mainImg)

    #get firstTable-2.html
    f2 = open('./templates/promotional/firstTable-2.html', 'r')
    part2 = f2.read()
    f.write(part2)

    #get subject header
    subjHeader = getSubjectHeader()
    f.write(subjHeader)

    #get firstTable-3.html
    f3 = open('./templates/promotional/firstTable-3.html', 'r')
    part3 = f3.read()
    f.write(part3)

    #get subject subheader
    subjHeader = getSubjectHeader()
    f.write(subjHeader)

    #get firstTable-4.html
    f4 = open('./templates/promotional/firstTable-4.html', 'r')
    part4 = f4.read()
    f.write(part4)

    #get random url for cta
    link = getRandomLink()
    f.write(link)

    #get firstTable-5.html
    f5 = open('./templates/promotional/firstTable-5.html', 'r')
    part5 = f5.read()
    f.write(part5)

    f1.close()
    f2.close()
    f3.close()
    f4.close()
    f5.close()

def constructSecondTable():
    #get secondTable.html
    f1 = open('./templates/promotional/secondTable.html', 'r')
    part1 = f1.read()
    f.write(part1)
    f1.close()

def addStore():
    #get grid1.html
    f1 = open('./templates/promotional/grid1.html', 'r')
    part1 = f1.read()
    f.write(part1)

    #get store img
    storeImg = getRandomStoreImg()
    f.write(storeImg)

    #get grid2.html
    f2 = open('./templates/promotional/grid2.html', 'r')
    part2 = f2.read()
    f.write(part2)

    #get random url
    link = getRandomLink()
    f.write(link)

    #get grid3.html
    f3 = open('./templates/promotional/grid3.html', 'r')
    part3 = f3.read()
    f.write(part3)

    f1.close()
    f2.close()
    f3.close()

def constructGrid():
    #get grid head
    f1 = open('./templates/promotional/gridHead.html', 'r')
    part = f1.read()
    f.write(part)
    f1.close()
    
    f.write("<tr>")
    addStore()
    f.write("<td width=\"14px\"></td>")
    addStore()
    f.write("<td width=\"14px\"></td>")
    addStore()
    f.write("</tr>")
    f.write("</table>")

def constructThirdTable():
    f1 = open('./templates/promotional/thirdTable.html', 'r')
    part1 = f1.read()
    f.write(part1)
    f1.close()

def main():
    constructFirstTable()
    constructSecondTable()
    constructGrid()
    constructThirdTable()
    f.close()

main()
