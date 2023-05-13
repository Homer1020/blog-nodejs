document.addEventListener('DOMContentLoaded', () => {
  (document.querySelectorAll('.notification .delete') || []).forEach(($delete) => {
    const $notification = $delete.parentNode

    $delete.addEventListener('click', () => {
      $notification.parentNode.removeChild($notification)
    })
  })
})

const back = () => {
  window.history.back()
  console.log(history.state)
}

const $commentForm = document.getElementById('comment-form')
const $commentList = document.getElementById('comment-list')

let dataUser = null

const handleComment = e => {
  e.preventDefault()

  if($commentForm.elements.body.value) {
    fetch('/api/comment', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body: $commentForm.elements.body.value,
        post_id: $commentForm.elements.post_id.value
      })
    })
    .then(r => r.json())
    .then(r => {
      if(!r.ok) {
        Swal.fire({
          title: 'Error!',
          text: 'Necesitas una cuenta para continuar',
          icon: 'error',
          confirmButtonText: 'Entendido'
        })
      } else {
        const html = `
          <li class="media">
            <figure class="media-left">
              <p class="image is-64x64"><img src="/files/${ dataUser.picture }"/></p>
            </figure>
            <div class="media-content">
              <div class="content">
                <p>
                  <strong>${ dataUser.nickname }</strong><br>
                  <span class="comment-body">${ $commentForm.elements.body.value }</span>
                  <br>
                  <small>
                    <a href="#" class="comment-delete" data-id="${ r.comment.id }">Eliminar</a>
                      <a href="#" class="comment-edit" data-id="${ r.comment.id }">Editar</a>
                  </small>
                  </p>
              </div>
            </div>
          </li>
        `.trim()
        $commentList.innerHTML += html
        $commentForm.reset()
      }
    })
  }
}

const handleCommentDelete = e => {
  if(e.target.classList.contains('comment-delete')) {
    e.preventDefault()

    const $a = e.target

    fetch(`/api/comments/delete/${ $a.dataset.id }`, {
        method: 'DELETE'
      })
      .then(r => r.json())
      .then(r => {
        if(r.ok) {
          $a.parentElement.parentElement.parentElement.parentElement.parentElement.remove()
          Swal.fire({
            title: 'Se elimino su comentario',
            text: 'Comentario eliminado correctamente',
            icon: 'success',
            confirmButtonText: 'Ok'
          })
        }
      })
  }
}

const $formEditComment = document.createElement('form')

$formEditComment.addEventListener('submit', e => {
  e.preventDefault()
  const $a = $formEditComment.parentElement.querySelector('.comment-update')
  fetch(`/api/comments/${ $a.dataset.id }/update`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      body: $formEditComment.elements.body.value
    })
  })
    .then(r => r.json())
    .then(r => {
      if(r.ok) {
        const { value } = $formEditComment.elements.body
        const $span = document.createElement('span')
        $span.classList.add('comment-body')
        $span.textContent = value
        $formEditComment.replaceWith($span)
        $a.classList.remove('comment-update')
        $a.classList.add('comment-edit')
        $a.textContent = 'Editar'
        Swal.fire({
          title: 'Se actualizo su comentario',
          text: 'Comentario actualizado correctamente',
          icon: 'success',
          confirmButtonText: 'Ok'
        })
      }
    })
})

const handleCommentEdit = e => {
  const $a = e.target
  if($a.classList.contains('comment-edit')) {
    e.preventDefault()
    if(document.querySelector('.comment-update')) {
      Swal.fire({
        title: 'Guarde los cambios!',
        text: 'Está editando un comentario, por favor de click en guardar antes de editar otro',
        icon: 'warning',
        confirmButtonText: 'Oki'
      })
    }
    else {
      const $parentComment = $a.parentElement.parentElement
      const $commentBody = $parentComment.querySelector('.comment-body')

      $a.classList.remove('comment-edit')
      $a.classList.add('comment-update')
      $a.textContent = 'Guardar'
      $formEditComment.innerHTML = `
        <input type="text" name="body" class="input is-primary mt-3" value="${ $commentBody.textContent }" autocomplete="off">
        <input type="submit" id="comment-save" style="display: none;">
      `

      $commentBody.replaceWith($formEditComment)
      $formEditComment.querySelector('input').select()
      $formEditComment.querySelector('input').focus()
    }

  } else if ($a.classList.contains('comment-update')) {
    e.preventDefault()
    $formEditComment.querySelector('#comment-save').click()
  }
}

if($commentForm) {
  if($commentForm.dataset.user) {
    dataUser = JSON.parse($commentForm.dataset.user)
  }
  $commentForm.addEventListener('submit', handleComment)

  $commentList.addEventListener('click', handleCommentDelete)
  $commentList.addEventListener('click', handleCommentEdit)
}