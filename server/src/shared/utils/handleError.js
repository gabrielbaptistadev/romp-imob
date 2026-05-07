export default function handleError(res, err) {

    if (err.errors && err.status) {
        return res.status(err.status).json({ errors: err.errors });
    }

    if (err.status) {
        return res.status(err.status).json(err);
    }

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            message: 'JSON inválido na requisição'
        });
    }

    console.error('[UNEXPECTED ERROR]', err);

    return res.status(500).json({
        message: 'Erro interno do servidor'
    });
}