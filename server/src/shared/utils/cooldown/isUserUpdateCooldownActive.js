export function getCooldownStatus(user, field, cooldownTime) {
    const last = user.cooldowns?.[field]?.lastChangedAt;

    if (!last) {
        return {
            inCooldown: false,
            remainingTime: 0
        };
    }

    const elapsed = Date.now() - last.getTime();
    const remainingTime = cooldownTime - elapsed;

    if (remainingTime > 0) {
        return {
            inCooldown: true,
            remainingTime
        };
    }

    return {
        inCooldown: false,
        remainingTime: 0
    };
}
