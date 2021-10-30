from mido import MidiFile
import mido
import pandas as pd 
import numpy as np 
sortlist = []
mid = mido.MidiFile('Adventure_of_Lifetime-Trombone.mid')
for i, track in enumerate(mid.tracks):
    print('Track {}: {}'.format(i, track.name))
    for msg in track:
        sortlist.append(msg)
sortlist.sort(key=lambda m: m.time)
for msg in sortlist: 
    print(msg)