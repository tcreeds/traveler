## Game Choice

Candy Crush is fun, but Tiny Wings seems like it's more fun to make. Candy Crush's mechanics are fairly straightforward, and while it would give me the opportunity to polish more, I'd rather take the challenge of something I'm not totally sure how to build. Tiny Wings is also more fun to play, in my opinion. 

Angry Birds would require a fairly robust 2D physics solution, and rolling my own 2D physics (again) doesn't appeal to me when there are so many solutions out there. Flappy bird, like Candy Crush, would be fairly straightforward to implement, and I want to go a bit bigger for this.

## First Steps

I'm going to write the shader for drawing hill curves first, because I really want to. Separating the rendering from the physics will allow me to simplify the collision detection to collision with a bezier curve, instead of having to work with multiple objects. This will also allow me to get the compressed look of the hill textures in the real game.

Bezier curves proved undesirable due to the complexity of getting a Y value from a given X value on a bezier curve, so I'm just using a regular function for the curve. With the shader working, I'll now move on to getting the infrastructure set up.

## Scope

My first goal is to replicate the mechanics of the game with a fairly static set of objects. Once I have that working, I'll set up a json file so that the hill shape and placement is data-driven. Also on the priority list is getting the camera to zoom in and out based on the bird's height.

With those done, I'll have a working game, and with what time I have left I'll get to add in the spice, such as coins, speed boosts, and multiple islands. Multiple islands is definitely a stretch goal.

## Day 3

Hill-sliding mechanic is working. A bug in the slope calculation (2x^2 != (2x)^2) I spent more time than I thought I would trying to figure out why the sliding looked so unnatural. Now that the important part is working, I'll set up the JSON file and read in the hills from that. It will have to be a plain JS file, since you want the solution to run locally, but it's a JSON file in spirit. Also on today's agenda is a camera that adapts to the height of the bird.

I've been playing Tiny Wings again for reference, and it seems as though it uses more flexible curves than I'm using. I suspect it does use bezier curves, but the parametric curve I'm using feels just fine, so I'm not going to try for bezier curves. I would like to attempt bezier curves, but I'll probably do it in my spare time in the coming months.

## Day 3 Scope Reassessment

All the components for sliding are set. The camera adjusts with the height of the bird so it is always on-screen, the sliding works fine, and the hills are defined by data. Now I have to decide what the objective is going to be, as Tiny Wings has several objectives - outrun the sun, outrun other birds - and different ways of scoring, like fever mode and coins. I don't expect to be able to get all of them in, so I must create a cohesive and satisfying experience with a more modest feature set.

I decided to go with a level-based design, similar to the islands, but with the intention of a candy-crush style long progression. I know this isn't a design job, so I'm not going to spend too much time on the backstory, but I'm thinking portals (at the beginning and end of each run) are a mode of transport used by you, the messenger, to travel between human colonies in a post-apocalyptic world. The first portal brings you into another dimension, where your oxygen tank will only sustain you for so long, and the second portal brings you back to the human (bird?) world.

I don't think I'll have time to go into too much depth with this, but a "zone" progression, a la the 5 different types of level in Plants vs Zombies, could be interesting. The next 10 levels have increased gravity, the 10 after that has poisonous clouds at a certain altitude, etc.

## Postmortem

I'm pretty pleased with how the game turned out. There's a level selector that adapts to the number of levels available, the game feels pretty good, and I had time to get a modest UI up and running. The code isn't nearly as clean as it could be, but since it's a short term assignment I wasn't too adamant about sustainable code. 

## Notes

I used an input manager I wrote a while ago for input, but as I wrote it I didn't think that would fall under outside solutions. Utils.js is all functions I wrote while making the game that didn't really belong in the main code.