if (queueSize() == 0) {
    var target = nearest();
    turn(direction(target));
    move(distance(target));
}
