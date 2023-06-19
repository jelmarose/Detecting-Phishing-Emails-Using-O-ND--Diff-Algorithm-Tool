def getRandomSubject(code):
    if code == 0:
        subjectReader = open('./templates/promotional/subjects.txt', 'r')
        subjectList = subjectReader.readlines()
        from random import randint    
        r = (randint(0,(len(subjectList)-1)))
        return subjectList[r]
    elif code == 1:
        subjectReader = open('./templates/official/subject.txt', 'r')
        subjectList = subjectReader.readlines()
        from random import randint    
        r = (randint(0,(len(subjectList)-1)))
        return subjectList[r]
    elif code == 2:
        subjectReader = open('./templates/alert/subject.txt', 'r')
        subjectList = subjectReader.readlines()
        from random import randint    
        r = (randint(0,(len(subjectList)-1)))
        return subjectList[r]
    
    
        
    #subjectReader = open('./templates/promotional/subjects.txt', 'r')
    #subjectList = subjectReader.readlines()
    #from random import randint    
    #r = (randint(0,(len(subjectList)-1)))
    
    #return subjectList[r]
