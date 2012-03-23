resetQueue();
var target = nearest();
if (canAttack(target)) {
    attack(target);
} else {
    turn(direction(target));
    move(distance(target));
}